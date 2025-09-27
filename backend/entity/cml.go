package entity

import "gorm.io/gorm"

type CML struct {
	gorm.Model
	InfoID                uint   `gorm:"not null "` // FK to Info
	Info				  Info   `gorm:"foreignKey:InfoID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	CMLNumber             int    `gorm:"column:cml_number ;unique" `
	CMLDescription        string `gorm:"column:cml_description;type:varchar(255)"`
	ActualOutsideDiameter int    `gorm:"column:actual_outside_diameter"`
	DesignThickness       int    `gorm:"column:design_thickness"`
	StructuralThickness   int    `gorm:"column:structural_thickness"`
	RequiredThickness     int    `gorm:"column:required_thickness"`

	TestPoints []TestPoint `gorm:"foreignKey:CMLID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}