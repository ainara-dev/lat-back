package database

import (
	"fmt"
	"github.com/jinzhu/gorm"
	m "github.com/malikov0216/lat-back/models"
)

var DB *gorm.DB

func Connect(host, dbname, user, password string, port uint) error {
	var err error
	connectionConfig := fmt.Sprintf("host=%s port=%d dbname=%s user=%s password=%s sslmode=disable", host, port, dbname, user, password)
	DB, err = gorm.Open("postgres", connectionConfig)
	if err != nil {
		return fmt.Errorf("error in connectDatabase(): %v", err)
	}
	DB.AutoMigrate(&m.User{}, &m.DirectionType{}, &m.Payment{}, &m.Meter{}, &m.Resident{}, &m.Premise{})
	return nil
}

func Disconnect() error {
	return DB.Close()
}