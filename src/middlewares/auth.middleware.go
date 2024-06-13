package middleware

import (
	"log"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/sanjaisamson/URL_Shortner/src/config"
	"github.com/sanjaisamson/URL_Shortner/src/handlers"
	"github.com/sanjaisamson/URL_Shortner/src/models"
)

func AccessTokenVerification(c *fiber.Ctx) error {
	// Take the Authorization header from the request headers
	header := c.Get("Authorization")
	headerParts := strings.Split(header, " ")
	if len(headerParts) != 2 || headerParts[0] != "Bearer" {
		return c.Status(fiber.StatusBadRequest).JSON("Invalid Authorization header format")
	}
	bearerLessToken := headerParts[1]
	var keyfunc jwt.Keyfunc = func(token *jwt.Token) (interface{}, error) {
		secretKey := config.Config("ACCESS_TOKEN_SECRET")
		log.Printf("Secret Key: %s", secretKey)
		return []byte(secretKey), nil
	}

	log.Print("key function : ", keyfunc)

	token, err := jwt.Parse(bearerLessToken, keyfunc)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON("Invalid Token")
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON("Invalid Token Claims")
	}
	userMail, mailOk := claims["email"].(string)
	if !mailOk {
		return c.Status(fiber.StatusUnauthorized).JSON("Invalid User Email in Token Claims")
	}
	userId, ok := claims["id"].(string)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON("Invalid User Email in Token Claims")
	}

	log.Println("Token is valid.")

	c.Locals("userMail", userMail)
	c.Locals("userId", userId)

	c.Next()

	return nil
}

func RefreshToken(c *fiber.Ctx) error {
	rToken := c.Cookies("r-token")

	// Log all cookies for debugging
	cookieHeader := c.Get("Cookie")
	log.Printf("Cookie header: %s", cookieHeader)

	// Check if the cookie exists
	if rToken == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Cookie 'r-token' not found",
		})
	}
	var keyfunc jwt.Keyfunc = func(token *jwt.Token) (interface{}, error) {
		secretKey := config.Config("REFRESH_TOKEN_SECRET")
		log.Printf("Secret Key: %s", secretKey)
		return []byte(secretKey), nil
	}
	token, err := jwt.Parse(rToken, keyfunc)
	if err != nil {
		log.Println("Error is ", err)
		log.Println("token claims ", token.Claims)
		return c.Status(fiber.StatusUnauthorized).JSON("Invalid Token")
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON("Invalid Token Claims")
	}
	userMail, mailOk := claims["email"].(string)
	if !mailOk {
		return c.Status(fiber.StatusUnauthorized).JSON("Invalid User Email in Token Claims")
	}
	userIdStr, ok := claims["id"].(string)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON("Invalid User UUId in Token Claims")
	}

	userId, err := uuid.Parse(userIdStr)
	user := models.User{
		ID:    userId,
		Email: userMail,
	}
	refreshToken, accessToken, tokenErr := handlers.GenerateTokens(user)

	if tokenErr != nil {
		return c.Status(fiber.StatusUnauthorized).JSON("Can't generate tokens")
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status":        "success",
		"message":       "user login successfull",
		"Access Token":  accessToken,
		"refresh Token": refreshToken,
	})
}
