package controller

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"dexon_test/config"
	"dexon_test/entity"
)

func GetAllInfo(c *fiber.Ctx) error {
	var infos []entity.Info
	DB := config.DB()
	result := DB.Find(&infos)
	if result.Error != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}
	return c.JSON(infos)
}

func GetInfoByID(c *fiber.Ctx) error {
	ID := c.Params("id")
	if ID == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "ID is required",
		})
	}

	var info entity.Info
	DB := config.DB()
	result := DB.Where("id = ?", ID).First(&info)
	if result.Error != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}
	return c.JSON(info)
}

func CreateInfo(c *fiber.Ctx) error {
	var info entity.Info
	if err := c.BodyParser(&info); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}
	DB := config.DB()
	result := DB.Create(&info)
	if result.Error != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}
	return c.JSON(info)
	}
func EditInfoByID(c *fiber.Ctx) error {
	ID := c.Params("id")
	if ID == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "ID is required",
		})
	}
	var info entity.Info
	DB := config.DB()
	result := DB.Where("id = ?", ID).First(&info)
	if result.Error != nil {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}
	if err := c.BodyParser(&info); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}
	result = DB.Save(&info)
	if result.Error != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": result.Error.Error(),
	})
	}
	return c.JSON(info)
}

func DeletInfoByID(c *fiber.Ctx) error {
	ID := c.Params("id")
	if ID == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "ID is required",
		})
	}
	var info entity.Info
	DB := config.DB()
	result := DB.Where("id = ?", ID).First(&info)
	if result.Error != nil {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}
	result = DB.Delete(&info)
	if result.Error != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}
	return c.JSON(info)
}