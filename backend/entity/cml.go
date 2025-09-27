package entity

import "gorm.io/gorm"

type CML struct {
	gorm.Model
	InfoID                uint   `gorm:"not null " json:"info_id"` // FK to Info
	Info				  Info   `gorm:"foreignKey:InfoID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	CMLNumber             int    `gorm:"column:cml_number" json:"cml_number"`
	CMLDescription        string `gorm:"column:cml_description;type:varchar(255)" json:"cml_description"`
	ActualOutsideDiameter int    `gorm:"column:actual_outside_diameter" json:"actual_outside_diameter"`
	DesignThickness       int    `gorm:"column:design_thickness" json:"design_thickness"`
	StructuralThickness   int    `gorm:"column:structural_thickness" json:"structural_thickness"`
	RequiredThickness     int    `gorm:"column:required_thickness" json:"required_thickness"`

	TestPoints []TestPoint `gorm:"foreignKey:CMLID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}