package entity

import "gorm.io/gorm"

type TestPoint struct {
	gorm.Model
	TPNumber uint `gorm:"column:tp_number" json:"tp_number"`
	TPDescription string `gorm:"column:tp_description;type:varchar(255)" json:"tp_description"`
	Note          string `gorm:"type:text" json:"note"`

	CMLID         uint   `gorm:"not null" json:"cml_id"` // FK to CML
	CML           CML    `gorm:"foreignKey:CMLID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Thicknesses []Thickness `gorm:"foreignKey:TestPointID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}
