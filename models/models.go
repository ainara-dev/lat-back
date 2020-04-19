package models

import "github.com/jinzhu/gorm"

type User struct {
	gorm.Model
	FirstName string `json:"firstName"`
	LastName string  `json:"lastName"`
	Phone string     `json:"phone" binding:"required"`
	Password string  `json:"password" binding:"required"`
	Email string     `json:"email"`
	DirectionType DirectionType `gorm:"foreignkey:DirectionId" json:"directionType"`
	DirectionId uint `json:"directionId"`
}

type DirectionType struct {
	gorm.Model
	Apartment bool `json:"apartment"`
	Office bool    `json:"office"`
	Boutique bool  `json:"boutique"`
}

type Premise struct {
	gorm.Model
	Name string
	Type string
	Address string
	Number string
	Price uint
	User User `gorm:"foreignkey:UserId"`
	Resident Resident `gorm:"foreignkey:ResidentId"`
	ResidentId uint
	UserId uint
}

type Resident struct {
	gorm.Model
	FirstName string
	LastName string
	Phone string
	Debt uint
}

type Payment struct {
	gorm.Model
	Month string
	Communal uint
	Status string
	Debt uint
	Resident Resident `gorm:"foreignkey:ResidentId"`
	ResidentId uint
}

type Meter struct {
	gorm.Model
	Month string
	Electric uint
	Gas uint
	Water uint
	PaymentAmount uint
	Premise Premise `gorm:"foreignkey:PremiseId"`
	Payment Payment `gorm:"foreignkey:PaymentId"`
	PremiseId uint
	PaymentId uint
}

type Result struct {
	DirectionResult []DirectionType `json:"result"`
}