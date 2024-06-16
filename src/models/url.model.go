package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Url struct {
	gorm.Model
	ID        uuid.UUID `gorm:"type:uuid;"`
	UserId    string    `json:"userId"`
	Url       string    `json:"url"`
	Url_code  string    `json:"url_code"`
	Clicks    string    `json:"clicks"`
	Short_url string    `json:"short_url"`
}
type Urls struct {
	Urls []Url `json:"Tokens"`
}

func (Url *Url) BeforeCreate(tx *gorm.DB) (err error) {
	Url.ID = uuid.New()
	return
}
