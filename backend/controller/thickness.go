package controller

import (
	"fmt"
	"net/http"

	"dexon_test/config"
	"dexon_test/entity"

	"github.com/gofiber/fiber/v2"
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
		fmt.Println("c.BodyParser error:", err)
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}
	DB := config.DB()
	result := DB.Create(&thickness)
	if result.Error != nil {
		fmt.Println("DB.Create error:", result.Error)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}
	return c.JSON(thickness)
	}

func EditThicknessByID(c *fiber.Ctx) error {
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
		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}
	if err := c.BodyParser(&thickness); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}
	result = DB.Save(&thickness)
	if result.Error != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}
	return c.JSON(thickness)
	}
func DeletThicknessByID(c *fiber.Ctx) error {
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
		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}
	result = DB.Delete(&thickness)
	if result.Error != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}
	return c.JSON(thickness)
	}