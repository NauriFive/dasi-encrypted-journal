package util

import (
	"log"
	"os"
)

func RequireEnvs() {
	envs := []string{
		"DB_URL",
		"PORT",
		"RESEND_API_KEY",
		"ALLOWED_ORIGINS",
		"GOOGLE_CLIENT_ID",
		"GOOGLE_CLIENT_SECRET",
		"GITHUB_CLIENT_ID",
		"GITHUB_CLIENT_SECRET",
		"PUBLIC_API_URL",
		"FRONTEND_URL",
	}

	for _, env := range envs {
		if os.Getenv(env) == "" {
			log.Fatal("Missing required env: ", env)
		}
	}
}