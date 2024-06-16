package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Log struct {
	gorm.Model
	ID         uuid.UUID `gorm:"type:uuid;"`
	LinkId     string    `json:"link_ID"`
	Browser    string    `json:"browser"`
	OS         string    `json:"OS"`
	DeviceType string    `json:"device_type"`
}
type Logs struct {
	Logs []Log `json:"Tokens"`
}

func (Log *Log) BeforeCreate(tx *gorm.DB) (err error) {
	Log.ID = uuid.New()
	return
}
