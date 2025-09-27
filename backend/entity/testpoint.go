package entity

import "gorm.io/gorm"

type TestPoint struct {
	gorm.Model
	TPNumber uint `gorm:"column:tp_number;unique"`
	TPDescription string `gorm:"column:tp_description;type:varchar(255)"`
	Note          string `gorm:"type:text"`

	CMLID         uint   `gorm:"not null"` // FK to CML
	CML           CML    `gorm:"foreignKey:CMLID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Thicknesses []Thickness `gorm:"foreignKey:TestPointID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}
