package controller

import (
	"fmt"
	"net/http"

	"dexon_test/config"
	"dexon_test/entity"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func getNextTpNumber(cmlID uint) (int, error) {
	DB := config.DB()
	var lastCML entity.TestPoint
	err := DB.Where("cml_id = ?", cmlID).Order("tp_number DESC").First(&lastCML).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return 1, nil // ถ้าไม่มี CML ของ InfoID นี้ → เริ่มจาก 1
		}
		return 0, err
	}
	return int(lastCML.TPNumber) + 1, nil
}
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
	fmt.Println("Raw body:", string(c.Body()))

	fmt.Println("Received CMLID:", testpoint.CMLID)
	nextNumber, err := getNextTpNumber(testpoint.CMLID)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	testpoint.TPNumber = uint(nextNumber)

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
func DeletTestPointByID(c *fiber.Ctx) error {
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
	result = DB.Delete(&testpoint)
	if result.Error != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}
	return c.JSON(testpoint)
	}