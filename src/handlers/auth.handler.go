package handlers

import (
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/sanjaisamson/URL_Shortner/src/config"
	"github.com/sanjaisamson/URL_Shortner/src/database"
	"github.com/sanjaisamson/URL_Shortner/src/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// Create a user
func CreateUser(c *fiber.Ctx) error {
	db := database.DB.Db
	user := new(models.User)
	// Store the body in the user and return error if encountered
	err := c.BodyParser(user)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "Something's wrong with your input",
			"data":    err,
		})
	}
	// verifying the input
	if user.Username == "" || user.Email == "" || user.Password == "" {
		// if any input missing
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "Username, email, and password are required",
		})
	}
	// loging the user **** Remove after use
	log.Printf("User loger: %+v\n", user)

	// Hashing the password using bcrypt
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "Failed to hash password",
			"data":    err.Error(),
		})
	}
	// add the hashed password to user.Password
	user.Password = string(hashedPassword)

	// verifying is new user already existed or not by verifying the mail id
	var existingUser models.User
	if err := db.Where("email = ?", user.Email).First(&existingUser).Error; err == nil {
		// Email already exists
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"status":  "error",
			"message": "Email already registered",
		})
	}
	// create new db instance
	err = db.Create(&user).Error
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Could not create user", "data": err})
	}
	// Return the created user if no error occurs
	return c.Status(201).JSON(fiber.Map{"status": "success", "message": "User has created", "data": user})
}

func LoginUser(c *fiber.Ctx) error {
	db := database.DB.Db

	type loginData struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	newLogin := new(loginData)
	err := c.BodyParser(newLogin)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "Something's wrong with your input",
			"data":    err.Error(),
		})
	}

	log.Printf("User logging in: %+v\n", newLogin)

	var currentUser models.User
	result := db.Where("email = ?", newLogin.Email).First(&currentUser)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"status":  "error",
				"message": "User not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "Database error",
			"data":    result.Error.Error(),
		})
	}

	log.Printf("Current user: %+v\n", currentUser)

	isAuthenticated := bcrypt.CompareHashAndPassword([]byte(currentUser.Password), []byte(newLogin.Password))
	if isAuthenticated != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"status":  "error",
			"message": "password is incorrect",
		})
	}
	refreshToken, accessToken, tokenError := GenerateTokens(currentUser)

	if tokenError != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"status":  "error",
			"message": "Error on Generate Tokens",
		})
	}

	c.Cookie(&fiber.Cookie{
		Name:     "r-token",
		Value:    refreshToken,
		Expires:  time.Now().Add(24 * time.Hour), // Set the expiration time as needed
		HTTPOnly: true,
		Secure:   false, // Set to true if serving over HTTPS
	})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status":       "success",
		"message":      "user login successfull",
		"Access Token": accessToken,
	})
}

func GenerateTokens(user models.User) (string, string, error) {
	access_token_secret := config.Config("ACCESS_TOKEN_SECRET")
	refresh_token_secret := config.Config("REFRESH_TOKEN_SECRET")

	log.Print("Access token secret key", access_token_secret)
	var aTokenExpirationTime = time.Now().UTC().Add(20 * time.Minute).Unix()
	var rTokenExpirationTime = time.Now().UTC().Add(24 * time.Hour).Unix()
	// var aTokenExpirationTime = time.Now().Add(10 * time.Minute).Format(time.RFC3339)
	// var rTokenExpirationTime = time.Now().Add(24 * time.Hour).Format(time.RFC3339)
	// var aTokenExpirationTime int64 = time.Now().Add(10 * time.Minute).Unix()
	// var rTokenExpirationTime int64 = time.Now().Add(24 * time.Hour).Unix()
	aToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":    user.ID,
		"email": user.Email,
		"exp":   aTokenExpirationTime, //float32(aTokenExpirationTime.Unix())
	})
	log.Print("atoken", aToken)

	accessToken, accessTokenError := aToken.SignedString([]byte(access_token_secret))
	if accessTokenError != nil {
		return "Access token is not ready", "", accessTokenError
	}
	log.Print("signature generation", accessToken)
	rToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":    user.ID,
		"email": user.Email,
		"exp":   rTokenExpirationTime,
	})
	refreshToken, refreshTokenError := rToken.SignedString([]byte(refresh_token_secret))
	if refreshTokenError != nil {
		return "Refresh token is not ready", "", refreshTokenError
	}

	SaveTokens(refreshToken, user)

	return refreshToken, accessToken, nil
}
func SaveTokens(tokenString string, user models.User) (string, error) {
	db := database.DB.Db

	var token models.Token
	result := db.Where("user_email = ?", user.Email).First(&token)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			// Create new token entry if not found
			token = models.Token{
				UserID:    user.ID.String(),
				UserEmail: user.Email,
				Token:     tokenString,
			}
			if err := db.Create(&token).Error; err != nil {
				return "Could not save token", err
			}
		} else {
			return "Database error", result.Error
		}
	} else {
		// Update existing token entry
		token.Token = tokenString
		token.UserID = user.ID.String()
		token.UserEmail = user.Email
		if err := db.Save(&token).Error; err != nil {
			return "Could not update token", err
		}
	}

	return "", nil
}

func Logout(c *fiber.Ctx) error {
	userEmail, ok := c.Locals("userMail").(string)
	if !ok {
		// Handle error if user email is not found in the context
		return c.Status(fiber.StatusInternalServerError).SendString("User email not found in context")
	}
	db := database.DB.Db

	var token models.Token
	result := db.Where("user_email = ?", userEmail).First(&token)
	if result.Error != nil {
		return c.SendString("sorry user not found with Email Id : " + userEmail)
	}
	db.Unscoped().Where("user_email = ?", userEmail).Delete(&token)

	return c.SendString("user logout successfully" + userEmail)
}
