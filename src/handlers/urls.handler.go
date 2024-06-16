package handlers

import (
	"fmt"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/mileusna/useragent"
	"github.com/sanjaisamson/URL_Shortner/src/database"
	"github.com/sanjaisamson/URL_Shortner/src/models"
)

func Createlink(c *fiber.Ctx) error {
	userId, ok := c.Locals("userId").(string)
	if !ok {
		// Handle error if user email is not found in the context
		return c.Status(fiber.StatusInternalServerError).SendString("User Id not found in context")
	}
	db := database.DB.Db
	Request := new(models.Url)
	// Store the body in the user and return error if encountered
	err := c.BodyParser(Request)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "Something's wrong with your input",
			"data":    err,
		})
	}
	if Request.Url == "" {
		// if any input missing
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "Username, email, and password are required",
		})
	}
	if Request.Url_code == "" {
		actualurl := Request.Url
		url_code := uuid.New()
		shorturl := fmt.Sprintf("http://localhost:3000/api/url/clicked/%s", url_code)
		newUrl := models.Url{
			UserId:    userId,
			Url:       actualurl,
			Url_code:  url_code.String(),
			Short_url: shorturl,
		}
		err = db.Create(&newUrl).Error
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Could not create user", "data": err})
		}
		actual_short_url := fmt.Sprintf("http://localhost:3000/api/url/clicked/%s/%s", url_code, newUrl.ID)
		return c.Status(200).JSON(fiber.Map{"status": "Success", "message": "New URL created", "Short_url": actual_short_url})
	} else {
		actualurl := Request.Url
		url_code := Request.Url_code
		shorturl := fmt.Sprintf("http://localhost:3000/api/url/clicked/%s", url_code)
		newUrl := models.Url{
			UserId:    userId,
			Url:       actualurl,
			Url_code:  url_code,
			Short_url: shorturl,
		}
		err = db.Create(&newUrl).Error
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Could not create user", "data": err})
		}
		actual_short_url := fmt.Sprintf("http://localhost:3000/api/url/clicked/%s/%s", url_code, newUrl.ID)
		return c.Status(200).JSON(fiber.Map{"status": "Success", "message": "New URL created", "Short_url": actual_short_url})

	}
}

func HandleVisits(c *fiber.Ctx) error {
	db := database.DB.Db
	userAgent := c.Get("User-Agent")
	ua := useragent.Parse(userAgent)
	Browser := fmt.Sprintf("%s : v %s", ua.Name, ua.Version)
	OperatingSystem := fmt.Sprintf("%s : v %s", ua.OS, ua.OSVersion)
	var Device string
	if ua.Mobile {
		Device = "Mobile"
	}
	if ua.Tablet {
		Device = "Tablet"
	}
	if ua.Desktop {
		Device = "Desktop"
	}
	if ua.Bot {
		Device = "Bot"
	}
	if ua.Name == "" || ua.Version == "" {
		Browser = "Unknown"
	}
	if ua.OS == "" || ua.OSVersion == "" {
		OperatingSystem = "Unknown"
	}
	if Device == "" {
		Device = "Unknown"
	}
	Id := c.Params("id")

	NewLog := models.Log{
		LinkId:     Id,
		Browser:    Browser,
		OS:         OperatingSystem,
		DeviceType: Device,
	}
	err := db.Create(&NewLog).Error
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Could not create new log", "data": err})
	}
	var count int64
	err = db.Model(&models.Log{}).Where("link_ID = ?", NewLog.LinkId).Count(&count).Error
	if err != nil {
		// Handle the error
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Failed to get click count", "data": err})
	}
	var UrlData models.Url
	db.Where("id = ?", NewLog.LinkId).First(&UrlData)
	CountStr := strconv.FormatInt(count, 10)
	UrlData.Clicks = CountStr
	err = db.Save(&UrlData).Error
	if err != nil {
		// Handle the error
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Failed to save click count", "data": err})
	}

	return c.Status(fiber.StatusInternalServerError).JSON(UrlData.Url)
}

func GetAllLinks(c *fiber.Ctx) error {
	userId, ok := c.Locals("userId").(string)
	if !ok {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "Something's wrong with your input",
		})
	}
	db := database.DB.Db
	var Urls []models.Url
	db.Where("user_id = ?", userId).Find(&Urls)
	return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
		"status": "success",
		"data":   Urls,
	})
}
