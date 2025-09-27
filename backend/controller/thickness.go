package controller

import (
	"fmt"
	"net/http"
	"time"

	"dexon_test/config"
	"dexon_test/entity"

	"github.com/gofiber/fiber/v2"
)
func GetThicknessByTestPointID(c *fiber.Ctx) error {
    ID := c.Params("id")
    if ID == "" {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "ID is required",
        })
    }

    type Result struct {
		ID             uint
        LineNumber     string    `json:"line_number"`
        CmlNumber      string    `json:"cml_number"`
        TPNumber       string    `json:"tp_number"`
        InspectionDate time.Time `json:"inspection_date"`
        ActualThickness int       `json:"actual_thickness"`
    }

    var results []Result
    DB := config.DB()

    err := DB.Table("thicknesses").
        Select(`thicknesses.id,infos.line_number, cmls.cml_number, test_points.tp_number, 
                thicknesses.inspection_date, thicknesses.actual_thickness`).
        Joins("JOIN test_points ON test_points.id = thicknesses.test_point_id").
        Joins("JOIN cmls ON cmls.id = test_points.cml_id").
        Joins("JOIN infos ON infos.id = cmls.info_id").
        Where("test_points.id = ? AND thicknesses.deleted_at IS NULL", ID).
        Scan(&results).Error

    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": err.Error(),
        })
    }

    return c.JSON(results)
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