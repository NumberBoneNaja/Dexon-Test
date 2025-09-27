package main

import (
	"dexon_test/config"
	"dexon_test/controller"

	"github.com/gofiber/fiber/v2"
)

const PORT = ":8000"
func main() {

	config.ConnectionDB()
	config.SetupDatabase()
	app := fiber.New()

	app.Use(CORSMiddleware())

	app.Get("/hello", func(c *fiber.Ctx) error {
		return c.SendString("Hello World")
	  })

	// info
	app.Get("/info", controller.GetAllInfo)
	app.Get("/info/:id", controller.GetInfoByID)
	app.Post("/info", controller.CreateInfo)
	app.Patch("/info/:id", controller.EditInfoByID)
	app.Delete("/info/:id", controller.DeletInfoByID)
	// cml
	app.Get("/cml/:id", controller.GetCMLByInfoID)
	app.Get("/cml/id/:id", controller.GetCMLByID)
	app.Post("/cml", controller.CreateCMLByInfoID)
	app.Patch("/cml/:id", controller.EditCMLByID)
	app.Delete("/cml/:id", controller.DeletCMLByID)
	// testpoint
	app.Get("/testpoint/:id", controller.GetTestPointByCMLID)
	app.Get("/testpoint/id/:id", controller.GetTestPointByID)
	app.Post("/testpoint", controller.CreateTestPointByCMLID)
	app.Patch("/testpoint/:id", controller.EditTestPointByID)
	app.Delete("/testpoint/:id", controller.DeletTestPointByID)
	// thickness
	app.Get("/thickness/:id", controller.GetThicknessByTestPointID)
	app.Get("/thickness/id/:id", controller.GetThicknessByID)
	app.Post("/thickness", controller.CreateThicknessByTestPointID)
	app.Patch("/thickness/:id", controller.EditThicknessByID)
	app.Delete("/thickness/:id", controller.DeletThicknessByID)
	
	
	  app.Listen("RUNNING ON " + PORT)
	  app.Listen(PORT)
	
}

func CORSMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		c.Set("Access-Control-Allow-Origin", "*")
		c.Set("Access-Control-Allow-Credentials", "true")
		c.Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		// ถ้าเป็น preflight request (OPTIONS) ให้ตอบ 204
		if c.Method() == fiber.MethodOptions {
			return c.SendStatus(fiber.StatusNoContent)
		}

		return c.Next()
	}
}