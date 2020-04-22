package database

import (
	"fmt"

	m "github.com/ainara-dev/lat-back/models"
	"github.com/jinzhu/gorm"
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
