package entity

import (
	"time"

	"gorm.io/gorm"
)

type Thickness struct {
    gorm.Model
    TestPointID     uint     // FK to TestPoint
	TestPoint      TestPoint `gorm:"foreignKey:TestPointID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
    InspectionDate  time.Time `gorm:"column:inspection_date;type:date"`
    ActualThickness int       `gorm:"column:actual_thickness"`
}
