package controller

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"dexon_test/config"
	"dexon_test/entity"

	"github.com/gofiber/fiber/v2"
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

    // อ่าน raw body
    body := c.Body()
    // แปลง JSON เป็น map ก่อน
    var data map[string]interface{}
    if err := json.Unmarshal(body, &data); err != nil {
        fmt.Println("Cannot parse JSON:", string(body))
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "Cannot parse JSON",
        })
    }

    // แปลง string date เป็น time.Time
    if v, ok := data["inservice_date"].(string); ok && v != "" {
        t, err := time.Parse("2006-01-02", v)
        if err != nil {
			fmt.Println("Invalid date format:", v)
            return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
                "error": "Invalid date format",
            })
        }
        data["inservice_date"] = t
    }

    // แปลง map กลับเป็น struct
    b, _ := json.Marshal(data)
    if err := json.Unmarshal(b, &info); err != nil {
		fmt.Println("Cannot parse JSON to struct:", string(b))
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "Cannot parse JSON to struct",
        })
    }

    // Insert ลง DB
    DB := config.DB()
    if result := DB.Create(&info); result.Error != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": result.Error.Error(),
        })
    }

    return c.JSON(info)
}



func EditInfoByID(c *fiber.Ctx) error {
    ID := c.Params("id")
    if ID == "" {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID is required"})
    }

    var info entity.Info
    DB := config.DB()
    if err := DB.First(&info, ID).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": err.Error()})
    }

    // อ่าน raw body
    body := c.Body()
    var data map[string]interface{}
    if err := json.Unmarshal(body, &data); err != nil {
        fmt.Println("Cannot parse JSON:", string(body))
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
    }

    // แปลง string date เป็น time.Time
    if v, ok := data["inservice_date"].(string); ok && v != "" {
        t, err := time.Parse("2006-01-02", v)
        if err != nil {
            fmt.Println("Invalid date format:", v)
            return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid date format"})
        }
        data["inservice_date"] = t
    }

    // แปลง map กลับเป็น struct
    b, _ := json.Marshal(data)
    if err := json.Unmarshal(b, &info); err != nil {
        fmt.Println("Cannot parse JSON to struct:", string(b))
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON to struct"})
    }

    // Save ลง DB
    if result := DB.Save(&info); result.Error != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": result.Error.Error()})
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