package api

import (
	"net/http"
	"strings"
	"time"

	"tunan-blog/env"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// LoginPayload defines the expected body for login requests
type LoginPayload struct {
	Password string `json:"password"`
}

// Login handles the admin login process.
func Login(c *fiber.Ctx) error {
	payload := new(LoginPayload)

	if err := c.BodyParser(payload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse request"})
	}

	// Compare the user's password with the stored bcrypt hash.
	err := bcrypt.CompareHashAndPassword([]byte(env.Prop.Auth.AdminPassword), []byte(payload.Password))
	if err != nil {
		// If the passwords don't match, or another error occurs, deny access.
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid credentials"})
	}

	// Create JWT claims
	claims := jwt.MapClaims{
		"name":  "Admin",
		"admin": true,
		"exp":   time.Now().Add(time.Hour * 72).Unix(), // Token expires in 72 hours
	}

	// Create token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Generate encoded token and send it as response.
	t, err := token.SignedString([]byte(env.Prop.Auth.JwtSecret))
	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.JSON(fiber.Map{"token": t})
}

// JWTMiddleware protects routes that require authentication.
func JWTMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Missing or malformed JWT"})
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Missing or malformed JWT"})
		}

		tokenString := parts[1]

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fiber.NewError(http.StatusUnauthorized, "Unexpected signing method")
			}
			return []byte(env.Prop.Auth.JwtSecret), nil
		})

		if err != nil || !token.Valid {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid or expired JWT"})
		}

		// Store user information from token in context for later use
		c.Locals("user", token.Claims)

		return c.Next()
	}
}
