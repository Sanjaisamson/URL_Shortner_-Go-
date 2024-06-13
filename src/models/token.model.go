package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Token struct {
	gorm.Model
	ID        uuid.UUID `gorm:"type:uuid;"`
	UserID    string    `json:"userId"`
	UserEmail string    `json:"userEmail"`
	Token     string    `json:"Token"`
}
type Tokens struct {
	Tokens []Token `json:"Tokens"`
}

func (token *Token) BeforeCreate(tx *gorm.DB) (err error) {
	token.ID = uuid.New()
	return
}
