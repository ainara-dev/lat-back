package models

import (
	"github.com/jinzhu/gorm"
)

type DirectionType struct {
	gorm.Model
	Apartment bool `json:"apartment"`
	Office bool    `json:"office"`
	Boutique bool  `json:"boutique"`
	Users []User
}

type User struct {
	gorm.Model
	FirstName string `json:"firstName"`
	LastName string  `json:"lastName"`
	Phone string     `json:"phone"`
	Password string  `json:"password"`
	Email string     `json:"email"`
	DirectionTypeID uint `json:"directionTypeID"`
	Premises []Premise `gorm:"auto_preload"`
}

type Premise struct {
	gorm.Model
	Type string  `json:"type"`
	Address string `json:"address"`
	Number string `json:"number"`
	Price uint `json:"price"`
	UserID uint `json:"userID"`
	ResidentID uint `json:"residentID"`
}

type Resident struct {
	gorm.Model
	FirstName string `json:"firstName"`
	LastName string `json:"lastName"`
	Phone string `json:"phone"`
	Debt uint `json:"debt"`
	Payments []Payment `gorm:"auto_preload"`
	Premises []Premise `gorm:"auto_preload"`
}

type Payment struct {
	gorm.Model
	Month string `json:"month"`
	Sum int `json:"sum"`
	Communal uint `json:"communal"`
	Status string `json:"status"`
	Debt uint `json:"debt"`
	CounterIndicator int64 `json:"counterIndicator"`
	ResidentID uint `json:"residentID"`
}

type Result struct {
	DirectionResult []DirectionType `json:"result"`
}

type CreatePremise struct {
	Resident
	Premise
	UserID uint `json:"id"`
}

type UpdateResidentAndPrice struct {
	Resident `json:"resident"`
	Premise `json:"premise"`
}
//
//type User struct {
//	gorm.Model
//	FirstName string `json:"firstName"`
//	LastName string  `json:"lastName"`
//	Phone string     `json:"phone"`
//	Password string  `json:"password"`
//	Email string     `json:"email"`
//	DirectionType DirectionType `gorm:"foreignkey:DirectionId" json:"directionType"`
//	DirectionId uint `json:"directionId"`
//}
//
//type DirectionType struct {
//	gorm.Model
//	Apartment bool `json:"apartment"`
//	Office bool    `json:"office"`
//	Boutique bool  `json:"boutique"`
//}
//
//type Premise struct {
//	gorm.Model
//	Name string
//	Type string  `json:"type"`
//	Address string `json:"address"`
//	Number string `json:"number"`
//	Price uint `json:"price"`
//	User User `gorm:"foreignkey:UserId" json:"user"`
//	Resident Resident `gorm:"foreignkey:ResidentId" json:"resident"`
//	ResidentId uint `json:"residentId"`
//	UserId uint `json:"userId"`
//}
//
//type Resident struct {
//	gorm.Model
//	FirstName string `json:"firstName"`
//	LastName string `json:"lastName"`
//	Phone string `json:"phone"`
//	Debt uint `json:"debt"`
//}
//
//type Payment struct {
//	gorm.Model
//	Month string
//	Communal uint
//	Status string
//	Debt uint
//	Resident Resident `gorm:"foreignkey:ResidentId"`
//	ResidentId uint
//}
//
//type Meter struct {
//	gorm.Model
//	Month string
//	Electric uint
//	Gas uint
//	Water uint
//	PaymentAmount uint
//	Premise Premise `gorm:"foreignkey:PremiseId"`
//	Payment Payment `gorm:"foreignkey:PaymentId"`
//	PremiseId uint
//	PaymentId uint
//}
//
