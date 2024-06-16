package routers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sanjaisamson/URL_Shortner/src/handlers"
	middleware "github.com/sanjaisamson/URL_Shortner/src/middlewares"
)

func SetupURL_Routes(app *fiber.App) {
	// grouping
	apiRoutes := app.Group("/api")
	urlRoutes := apiRoutes.Group("/url")
	// routes
	urlRoutes.Post("/create", middleware.AccessTokenVerification, handlers.Createlink)
	urlRoutes.Get("/clicked/:code/:id", handlers.HandleVisits)
	urlRoutes.Post("/links", middleware.AccessTokenVerification, handlers.GetAllLinks)
}
