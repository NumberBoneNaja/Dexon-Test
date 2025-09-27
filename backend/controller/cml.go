package controller

import (
	"fmt"
	"math"
	"net/http"

	"dexon_test/config"
	"dexon_test/entity"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

var PipeSizeToOD = map[float64]float64{
    0.125: 10.3,
    0.25:  13.7,
    0.357: 17.1,
    0.5:   21.3,
    0.75:  26.7,
    1.0:   33.4,
    1.25:  42.2,
    1.5:   48.3,
    2.0:   60.3,
    2.5:   73.0,
    3.0:   88.9,
    3.5:   101.6,
    4.0:   114.3,
    5.0:   141.3,
    6.0:   168.3,
    8.0:   219.1,
    10.0:  273.0,
    12.0:  323.8,
    14.0:  355.6,
    16.0:  406.4,
    18.0:  457.0,
}

func getStructuralThickness(pipeSize int) float64 {
	switch {
	case pipeSize <= 2:
		return 1.8
	case pipeSize == 3:
		return 2.0
	case pipeSize == 4:
		return 2.3
	case pipeSize >= 6 && pipeSize <= 18:
		return 2.8
	case pipeSize >= 20:
		return 3.1
	default:
		return 0
	}
}

func getNextCMLNumber(infoID uint) (int, error) {
	DB := config.DB()
	var lastCML entity.CML
	err := DB.Where("info_id = ?", infoID).Order("cml_number DESC").First(&lastCML).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return 1, nil // ถ้าไม่มี CML ของ InfoID นี้ → เริ่มจาก 1
		}
		return 0, err
	}
	return lastCML.CMLNumber + 1, nil
}

func GetCMLByInfoID(c *fiber.Ctx) error {
	ID := c.Params("id")
	if ID == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "ID is required",
		})
	}
	var info entity.Info
	DB := config.DB()
	info_result := DB.Where("id = ?", ID).First(&info)
	if info_result.Error != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": info_result.Error.Error(),
		})
	}

	var cml []entity.CML
	
	result := DB.Where("info_id = ?", ID).Find(&cml)
	if result.Error != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}
	return c.JSON(fiber.Map{
		"info": info.LineNumber,
		"cml":  cml,
	})
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
			fmt.Println("c.BodyParser error:", err)
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
		}
	
		DB := config.DB()
	
		// ตรวจสอบว่า InfoID มีอยู่จริง
		var info entity.Info
		fmt.Println("Received InfoID:", cml.InfoID)
		if err := DB.First(&info, cml.InfoID).Error; err != nil {
			fmt.Println("DB.First error:", err)
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"error": fmt.Sprintf("InfoID %d not found", cml.InfoID),
			})
		}
		cmlNumber, err := getNextCMLNumber(cml.InfoID)
		if err != nil {
			fmt.Println("DB.Create error:", err)
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		cml.CMLNumber = cmlNumber

	
	
		od, ok := PipeSizeToOD[float64(info.PipeSize)]
		if !ok {
			fmt.Println("PipeSize not supported:", info.PipeSize)
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"error": fmt.Sprintf("PipeSize %d not supported", info.PipeSize),
			})
		}
		cml.ActualOutsideDiameter = int(math.Round(od))
	

		designPressure := float64(info.DesignPressure)
		actualOD := float64(cml.ActualOutsideDiameter)
		stress := float64(info.Stress)
		jointEff := float64(info.JointEfficiency)
		if jointEff > 1 {
			jointEff = jointEff / 100.0
		}
	
		denom := (2.0 * stress * jointEff) + (0.8 * designPressure)
		if denom <= 0 {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"error": "invalid parameters for design thickness calculation",
			})
		}
		designThk := (designPressure * actualOD) / denom
		cml.DesignThickness = int(math.Ceil(designThk))
	
	
		structThk := getStructuralThickness(info.PipeSize)
		if structThk == 0 {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"error": fmt.Sprintf("PipeSize %d not supported for structural thickness", info.PipeSize),
			})
		}
		cml.StructuralThickness = int(math.Round(structThk))
	
	
		if cml.DesignThickness > cml.StructuralThickness {
			cml.RequiredThickness = cml.DesignThickness
		} else {
			cml.RequiredThickness = cml.StructuralThickness
		}
	
	
		if err := DB.Create(&cml).Error; err != nil {
			fmt.Println("DB.Create error:", err)
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
	
		// Preload Info เพื่อ response
		DB.Preload("Info").First(&cml, cml.ID)
		return c.Status(http.StatusCreated).JSON(cml)
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