package controller

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"dexon_test/config"
	"dexon_test/entity"
)

func GetCMLByInfoID(c *fiber.Ctx) error {
	ID := c.Params("id")
	if ID == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "ID is required",
		})
	}

	var cml entity.CML
	DB := config.DB()
	result := DB.Where("info_id = ?", ID).Find(&cml)
	if result.Error != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}
	return c.JSON(cml)	
}

func GetCMLByID(c *fiber.Ctx) error {
	ID := c.Params("id")
	if ID == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "ID is required",
		})
	}

	var cml entity.CML
	DB := config.DB()
	result := DB.Where("id = ?", ID).First(&cml)
	if result.Error != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}
	return c.JSON(cml)
	}

func CreateCMLByInfoID(c *fiber.Ctx) error {
	var cml entity.CML
	if err := c.BodyParser(&cml); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}
	DB := config.DB()
	result := DB.Create(&cml)
	if result.Error != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}
	return c.JSON(cml)
}


func EditCMLByID(c *fiber.Ctx) error {
	ID := c.Params("id")
	if ID == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "ID is required",
		})
	}
	var cml entity.CML
	DB := config.DB()
	result := DB.Where("id = ?", ID).First(&cml)
	if result.Error != nil {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}
	if err := c.BodyParser(&cml); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}
	result = DB.Save(&cml)
	if result.Error != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}
	return c.JSON(cml)
	}

func DeletCMLByID(c *fiber.Ctx) error {
	ID := c.Params("id")
	if ID == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "ID is required",
		})
	}
	var cml entity.CML
	DB := config.DB()
	result := DB.Where("id = ?", ID).First(&cml)
	if result.Error != nil {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}
	result = DB.Delete(&cml)
	if result.Error != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}
	return c.JSON(cml)
	}