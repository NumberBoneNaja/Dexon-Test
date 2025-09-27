package entity

import (
	"time"

	"gorm.io/gorm"
)

type Thickness struct {
    gorm.Model
    TestPointID     uint    `json:"test_point_id"` // FK to TestPoint
	TestPoint      TestPoint `gorm:"foreignKey:TestPointID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"testpoint"`
    InspectionDate  time.Time `gorm:"column:inspection_date;type:date" json:"inspection_date"`
    ActualThickness int       `gorm:"column:actual_thickness" json:"actual_thickness"`
}
