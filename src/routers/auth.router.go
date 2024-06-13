package routers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sanjaisamson/URL_Shortner/src/handlers"
	middleware "github.com/sanjaisamson/URL_Shortner/src/middlewares"
)

// SetupRoutes func
func SetupAuthRoutes(app *fiber.App) {
	// grouping
	api := app.Group("/api")
	v1 := api.Group("/user")
	// routes
	v1.Post("/create", handlers.CreateUser)
	v1.Post("/login", handlers.LoginUser)
	v1.Post("/logout", middleware.AccessTokenVerification, handlers.Logout)
	v1.Get("/refresh", middleware.RefreshToken)
}
