package entity

import (
	"time"

	"gorm.io/gorm"
)

type Info struct {
    gorm.Model
    LineNumber string `gorm:"column:line_number;type:varchar(100);unique"`
    Location            string    `gorm:"type:varchar(255)"`
    From                string    `gorm:"column:from_location;type:varchar(255)"`
    To                  string    `gorm:"column:to_location;type:varchar(255)"`
    DrawingNumber       string    `gorm:"column:drawing_number;type:varchar(100)"`
    Service             string    `gorm:"type:varchar(100)"`
    Material            string    `gorm:"type:varchar(100)"`
    InserviceDate       time.Time `gorm:"column:inservice_date;type:date"`
    PipeSize            int       `gorm:"column:pipe_size"`
    OriginalThickness   int       `gorm:"column:original_thickness"`
    Stress              int       `gorm:"column:stress"`
    JointEfficiency     int       `gorm:"column:joint_efficiency"`
    Ca                  int       `gorm:"column:ca"`
    DesignLife          int       `gorm:"column:design_life"`
    DesignPressure      int       `gorm:"column:design_pressure"`
    OperatingPressure   int       `gorm:"column:operating_pressure"`
    DesignTemperature   int       `gorm:"column:design_temperature"`
    OperatingTemperature int      `gorm:"column:operating_temperature"`

    CMLs []CML `gorm:"foreignKey:InfoID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}
