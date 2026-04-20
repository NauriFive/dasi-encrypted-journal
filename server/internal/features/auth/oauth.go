package auth

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/trnahnh/katana-id/internal/db/generated"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
	"golang.org/x/oauth2/google"
)

func oauthConfig(provider string) (*oauth2.Config, error) {
	redirect := os.Getenv("PUBLIC_API_URL") + "/auth/" + provider + "/callback"
	switch provider {
	case "google":
		return &oauth2.Config{
			ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
			ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
			RedirectURL:  redirect,
			Endpoint:     google.Endpoint,
			Scopes:       []string{"openid", "email", "profile"},
		}, nil
	case "github":
		return &oauth2.Config{
			ClientID:     os.Getenv("GITHUB_CLIENT_ID"),
			ClientSecret: os.Getenv("GITHUB_CLIENT_SECRET"),
			RedirectURL:  redirect,
			Endpoint:     github.Endpoint,
			Scopes:       []string{"read:user", "user:email"},
		}, nil
	}
	return nil, fmt.Errorf("unknown provider %q", provider)
}

func randomState() (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return base64.RawURLEncoding.EncodeToString(b), nil
}

func (h *Handler) OAuthStart(w http.ResponseWriter, r *http.Request) {
	provider := chi.URLParam(r, "provider")
	cfg, err := oauthConfig(provider)
	if err != nil {
		http.NotFound(w, r)
		return
	}

	state, err := randomState()
	if err != nil {
		log.Printf("OAuthStart: randomState failed: %v", err)
		redirectAuthError(w, r, "state")
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "oauth_state",
		Value:    state,
		Path:     "/",
		MaxAge:   5 * 60,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	})

	http.Redirect(w, r, cfg.AuthCodeURL(state), http.StatusFound)
}

func (h *Handler) OAuthCallback(w http.ResponseWriter, r *http.Request) {
	provider := chi.URLParam(r, "provider")
	cfg, err := oauthConfig(provider)
	if err != nil {
		http.NotFound(w, r)
		return
	}

	stateCookie, err := r.Cookie("oauth_state")
	if err != nil || stateCookie.Value == "" || stateCookie.Value != r.URL.Query().Get("state") {
		redirectAuthError(w, r, "state")
		return
	}
	http.SetCookie(w, &http.Cookie{Name: "oauth_state", Value: "", Path: "/", MaxAge: -1})

	code := r.URL.Query().Get("code")
	if code == "" {
		redirectAuthError(w, r, "code")
		return
	}

	ctx := r.Context()
	token, err := cfg.Exchange(ctx, code)
	if err != nil {
		log.Printf("OAuthCallback: Exchange failed: %v", err)
		redirectAuthError(w, r, "exchange")
		return
	}

	email, providerAccountID, err := fetchIdentity(ctx, provider, cfg, token)
	if err != nil {
		log.Printf("OAuthCallback: fetchIdentity failed: %v", err)
		redirectAuthError(w, r, "identity")
		return
	}

	user, err := h.Queries.GetUserByEmail(ctx, email)
	if errors.Is(err, pgx.ErrNoRows) {
		username := strings.Split(email, "@")[0]
		user, err = h.Queries.CreateUser(ctx, gendb.CreateUserParams{
			Username: username,
			Email:    email,
		})
	}
	if err != nil {
		log.Printf("OAuthCallback: user provisioning failed: %v", err)
		redirectAuthError(w, r, "user")
		return
	}

	if err := h.Queries.UpsertProvider(ctx, gendb.UpsertProviderParams{
		UserID:            user.ID,
		ProviderName:      provider,
		ProviderAccountID: providerAccountID,
	}); err != nil {
		log.Printf("OAuthCallback: UpsertProvider failed: %v", err)
		redirectAuthError(w, r, "provider")
		return
	}

	session, err := h.Queries.CreateSession(ctx, gendb.CreateSessionParams{
		Email:     email,
		ExpiresAt: pgtype.Timestamptz{Time: time.Now().Add(7 * 24 * time.Hour), Valid: true},
	})
	if err != nil {
		log.Printf("OAuthCallback: CreateSession failed: %v", err)
		redirectAuthError(w, r, "session")
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "session",
		Value:    session.Token.String(),
		Path:     "/",
		MaxAge:   7 * 24 * 60 * 60,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	})

	http.Redirect(w, r, os.Getenv("FRONTEND_URL")+"/journal", http.StatusFound)
}

func fetchIdentity(ctx context.Context, provider string, cfg *oauth2.Config, token *oauth2.Token) (email, accountID string, err error) {
	client := cfg.Client(ctx, token)

	switch provider {
	case "google":
		var body struct {
			Sub           string `json:"sub"`
			Email         string `json:"email"`
			EmailVerified bool   `json:"email_verified"`
		}
		if err := getJSON(client, "https://openidconnect.googleapis.com/v1/userinfo", &body); err != nil {
			return "", "", err
		}
		if body.Email == "" || !body.EmailVerified {
			return "", "", fmt.Errorf("google: email missing or unverified")
		}
		return body.Email, body.Sub, nil

	case "github":
		var user struct {
			ID    int64  `json:"id"`
			Email string `json:"email"`
		}
		if err := getJSON(client, "https://api.github.com/user", &user); err != nil {
			return "", "", err
		}
		var emails []struct {
			Email    string `json:"email"`
			Primary  bool   `json:"primary"`
			Verified bool   `json:"verified"`
		}
		if err := getJSON(client, "https://api.github.com/user/emails", &emails); err != nil {
			return "", "", err
		}
		for _, e := range emails {
			if e.Primary && e.Verified {
				return e.Email, fmt.Sprintf("%d", user.ID), nil
			}
		}
		return "", "", fmt.Errorf("github: no primary verified email")
	}
	return "", "", fmt.Errorf("unknown provider %q", provider)
}

func getJSON(client *http.Client, url string, out any) error {
	resp, err := client.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 400 {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("GET %s: %d %s", url, resp.StatusCode, string(body))
	}
	return json.NewDecoder(resp.Body).Decode(out)
}

func redirectAuthError(w http.ResponseWriter, r *http.Request, reason string) {
	target := os.Getenv("FRONTEND_URL") + "/?auth_error=" + url.QueryEscape(reason)
	http.Redirect(w, r, target, http.StatusFound)
}
