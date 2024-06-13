package routers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sanjaisamson/URL_Shortner/src/handlers"
	middleware "github.com/sanjaisamson/URL_Shortner/src/middlewares"
)

// SetupRoutes func
func SetupURL_Routes(app *fiber.App) {
	// grouping
	api := app.Group("/api")
	v1 := api.Group("/url")
	// routes
	v1.Post("/create", handlers.CreateUser)
	v1.Post("/clicked/:code/:id", handlers.LoginUser)
	v1.Post("/links", middleware.AccessTokenVerification, handlers.Logout)
}
