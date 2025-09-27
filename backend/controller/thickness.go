package controller
import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"dexon_test/config"
	"dexon_test/entity"
)
func GetThicknessByTestPointID(c *fiber.Ctx) error {
	ID := c.Params("id")
	if ID == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "ID is required",
		})
	}

	var thicknesses []entity.Thickness
	DB := config.DB()
	result := DB.Where("test_point_id = ?", ID).Find(&thicknesses)
	if result.Error != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}
	return c.JSON(thicknesses)
		
	}

func GetThicknessByID(c *fiber.Ctx) error {
	ID := c.Params("id")
	if ID == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "ID is required",
		})
	}

	var thickness entity.Thickness
	DB := config.DB()
	result := DB.Where("id = ?", ID).First(&thickness)
	if result.Error != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}
	return c.JSON(thickness)
}
func CreateThicknessByTestPointID(c *fiber.Ctx) error {
	var thickness entity.Thickness
	if err := c.BodyParser(&thickness); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}
	DB := config.DB()
	result := DB.Create(&thickness)
	if result.Error != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}
	return c.JSON(thickness)
	}