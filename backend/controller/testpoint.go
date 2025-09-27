package controller
import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"dexon_test/config"
	"dexon_test/entity"
)
func GetTestPointByCMLID(c *fiber.Ctx) error {
	ID := c.Params("id")
	if ID == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "ID is required",
		})
	}

	var testpoints []entity.TestPoint
	DB := config.DB()
	result := DB.Where("cml_id = ?", ID).Find(&testpoints)
	if result.Error != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}
	return c.JSON(testpoints)
	}

func GetTestPointByID(c *fiber.Ctx) error {
	ID := c.Params("id")
	if ID == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "ID is required",
		})
	}

	var testpoint entity.TestPoint
	DB := config.DB()
	result := DB.Where("id = ?", ID).First(&testpoint)
	if result.Error != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}
	return c.JSON(testpoint)
	}
func CreateTestPointByCMLID(c *fiber.Ctx) error {
	var testpoint entity.TestPoint
	if err := c.BodyParser(&testpoint); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}
	DB := config.DB()
	result := DB.Create(&testpoint)
	if result.Error != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}
	return c.JSON(testpoint)
	}
func EditTestPointByID(c *fiber.Ctx) error {
	ID := c.Params("id")
	if ID == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "ID is required",
		})
	}
	var testpoint entity.TestPoint
	DB := config.DB()
	result := DB.Where("id = ?", ID).First(&testpoint)
	if result.Error != nil {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}
	if err := c.BodyParser(&testpoint); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}
	result = DB.Save(&testpoint)
	if result.Error != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}
	return c.JSON(testpoint)
	}