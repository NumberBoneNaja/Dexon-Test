package entity

import (
	"time"

	"gorm.io/gorm"
)

type Info struct {
    gorm.Model
    LineNumber          string    `gorm:"column:line_number;type:varchar(100);unique" json:"line_number"`
    Location            string    `gorm:"type:varchar(255)" json:"location"`
    From                string    `gorm:"column:from_location;type:varchar(255)" json:"from"`
    To                  string    `gorm:"column:to_location;type:varchar(255)" json:"to"`
    DrawingNumber       string    `gorm:"column:drawing_number;type:varchar(100)" json:"drawing_number"`
    Service             string    `gorm:"type:varchar(100)" json:"service"`
    Material            string    `gorm:"type:varchar(100)" json:"material"`
    InserviceDate       time.Time `gorm:"column:inservice_date;type:date" json:"inservice_date"`
    PipeSize            int       `gorm:"column:pipe_size" json:"pipe_size"`
    OriginalThickness   int       `gorm:"column:original_thickness" json:"original_thickness"`
    Stress              int       `gorm:"column:stress" json:"stress"`
    JointEfficiency     int       `gorm:"column:joint_efficiency" json:"joint_efficiency"`
    Ca                  int       `gorm:"column:ca" json:"ca"`
    DesignLife          int       `gorm:"column:design_life" json:"design_life"`
    DesignPressure      int       `gorm:"column:design_pressure" json:"design_pressure"`
    OperatingPressure   int       `gorm:"column:operating_pressure" json:"operating_pressure"`
    DesignTemperature   int       `gorm:"column:design_temperature" json:"design_temperature"`
    OperatingTemperature int      `gorm:"column:operating_temperature" json:"operating_temperature"`

    CMLs []CML `gorm:"foreignKey:InfoID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" `
}

