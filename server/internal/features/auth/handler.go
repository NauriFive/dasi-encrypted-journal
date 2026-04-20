package auth

import (
	"context"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/resend/resend-go/v3"
	"github.com/trnahnh/katana-id/internal/db/generated"
	"github.com/trnahnh/katana-id/util"
)

var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)

type sendOTPRequest struct {
	Email string
}

type successResponse struct {
	Message string `json:"message"`
}

type meResponse struct {
	Email    string `json:"email"`
	Username string `json:"username"`
}

type Handler struct {
	Queries     *gendb.Queries
	EmailClient *resend.Client
}

func (h *Handler) Me(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("session")
	if err != nil {
		log.Printf("Me: missing session cookie: %v", err)
		util.WriteJSON(w, http.StatusUnauthorized, util.ErrorResponse{Error: "Unauthorized"})
		return
	}

	token, err := uuid.Parse(cookie.Value)
	if err != nil {
		log.Printf("Me: invalid session cookie value: %v", err)
		util.WriteJSON(w, http.StatusUnauthorized, util.ErrorResponse{Error: "Unauthorized"})
		return
	}

	ctx := r.Context()
	session, err := h.Queries.GetSession(ctx, pgtype.UUID{
		Bytes: token,
		Valid: true,
	})
	if err != nil {
		log.Printf("Me: GetSession failed: %v", err)
		util.WriteJSON(w, http.StatusUnauthorized, util.ErrorResponse{Error: "Unauthorized"})
		return
	}

	email := session.Email
	user, err := h.Queries.GetUserByEmail(ctx, email)
	if err != nil {
		log.Printf("Me: GetUserByEmail failed for %s: %v", email, err)
		util.WriteJSON(w, http.StatusUnauthorized, util.ErrorResponse{Error: "Unauthorized"})
		return
	}

	util.WriteJSON(w, http.StatusOK, meResponse{
		Email:    email,
		Username: user.Username,
	})
}

func (h *Handler) Logout(w http.ResponseWriter, r *http.Request) {
	cookie, _ := r.Cookie("session")
	id, _ := uuid.Parse(cookie.Value)

	token := pgtype.UUID{
		Valid: true,
		Bytes: id,
	}
	ctx := r.Context()
	h.Queries.DeleteSessionByToken(ctx, token)

	http.SetCookie(w, &http.Cookie{
		Name:   "session",
		Value:  "",
		Path:   "/",
		MaxAge: -1,
	})

	util.WriteJSON(w, http.StatusOK, successResponse{
		Message: "Logged out",
	})
}

func (h *Handler) SendOTP(w http.ResponseWriter, r *http.Request) {
	var req sendOTPRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("SendOTP: failed to decode request: %v", err)
		util.WriteJSON(w, http.StatusBadRequest, util.ErrorResponse{Error: "Invalid request"})
		return
	}

	if !emailRegex.MatchString(req.Email) {
		log.Printf("SendOTP: invalid email: %s", req.Email)
		util.WriteJSON(w, http.StatusBadRequest, util.ErrorResponse{Error: "Invalid email"})
		return
	}

	otp, err := genOTP()
	if err != nil {
		log.Printf("SendOTP: genOTP failed: %v", err)
		util.WriteJSON(w, http.StatusInternalServerError, util.ErrorResponse{Error: "Something went wrong"})
		return
	}

	expires := pgtype.Timestamptz{
		Time:  time.Now().Add(5 * time.Minute),
		Valid: true,
	}

	if err := h.Queries.CreateOTP(context.Background(), gendb.CreateOTPParams{
		Email:     req.Email,
		Otp:       otp,
		ExpiresAt: expires,
	}); err != nil {
		log.Printf("SendOTP: CreateOTP failed: %v", err)
		util.WriteJSON(w, http.StatusInternalServerError, util.ErrorResponse{Error: "Something went wrong"})
		return
	}

	if err := sendOTP(h.EmailClient, req.Email, otp); err != nil {
		log.Printf("SendOTP: sendOTP (Resend) failed: %v", err)
		util.WriteJSON(w, http.StatusInternalServerError, util.ErrorResponse{Error: "Something went wrong"})
		return
	}

	log.Printf("SendOTP: OTP sent to %s", req.Email)
	util.WriteJSON(w, http.StatusOK, successResponse{Message: "OTP sent"})
}

type verifyOTPRequest struct {
	Email string
	OTP   string
}

func (h *Handler) VerifyOTP(w http.ResponseWriter, r *http.Request) {
	var req verifyOTPRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("VerifyOTP: failed to decode request: %v", err)
		util.WriteJSON(w, http.StatusBadRequest, util.ErrorResponse{Error: "Invalid request"})
		return
	}

	if !emailRegex.MatchString(req.Email) {
		log.Printf("VerifyOTP: invalid email: %s", req.Email)
		util.WriteJSON(w, http.StatusBadRequest, util.ErrorResponse{Error: "Invalid email"})
		return
	}

	ctx := context.Background()

	otpRow, err := h.Queries.GetOTPByEmail(ctx, req.Email)
	if errors.Is(err, pgx.ErrNoRows) {
		log.Printf("VerifyOTP: no valid OTP found for %s", req.Email)
		util.WriteJSON(w, http.StatusUnauthorized, util.ErrorResponse{Error: "Invalid or expired OTP"})
		return
	}
	if err != nil {
		log.Printf("VerifyOTP: GetOTPByEmail failed: %v", err)
		util.WriteJSON(w, http.StatusInternalServerError, util.ErrorResponse{Error: "Something went wrong"})
		return
	}

	if otpRow.Otp != req.OTP {
		log.Printf("VerifyOTP: incorrect OTP for %s", req.Email)
		util.WriteJSON(w, http.StatusUnauthorized, util.ErrorResponse{Error: "Invalid or expired OTP"})
		return
	}

	if err := h.Queries.DeleteOTPsByEmail(ctx, req.Email); err != nil {
		log.Printf("VerifyOTP: DeleteOTPsByEmail failed: %v", err)
		util.WriteJSON(w, http.StatusInternalServerError, util.ErrorResponse{Error: "Something went wrong"})
		return
	}

	_, err = h.Queries.GetUserByEmail(ctx, req.Email)
	if errors.Is(err, pgx.ErrNoRows) {
		username := strings.Split(req.Email, "@")[0]
		_, err = h.Queries.CreateUser(ctx, gendb.CreateUserParams{
			Username: username,
			Email:    req.Email,
		})
		if err != nil {
			log.Printf("VerifyOTP: CreateUser failed for %s: %v", req.Email, err)
			util.WriteJSON(w, http.StatusInternalServerError, util.ErrorResponse{Error: "Something went wrong"})
			return
		}
	} else if err != nil {
		log.Printf("VerifyOTP: GetUserByEmail failed: %v", err)
		util.WriteJSON(w, http.StatusInternalServerError, util.ErrorResponse{Error: "Something went wrong"})
		return
	}

	session, err := h.Queries.CreateSession(ctx, gendb.CreateSessionParams{
		Email:     req.Email,
		ExpiresAt: pgtype.Timestamptz{Time: time.Now().Add(7 * 24 * time.Hour), Valid: true},
	})
	if err != nil {
		log.Printf("VerifyOTP: CreateSession failed: %v", err)
		util.WriteJSON(w, http.StatusInternalServerError, util.ErrorResponse{Error: "Something went wrong"})
		return
	}

	token := session.Token.String()

	http.SetCookie(w, &http.Cookie{
		Name:     "session",
		Value:    token,
		Path:     "/",
		MaxAge:   7 * 24 * 60 * 60,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	})

	util.WriteJSON(w, http.StatusOK, successResponse{Message: "OTP verified"})
}
