package services

import (
	"time"

	"github.com/ainara-dev/lat-back/config"
	"github.com/ainara-dev/lat-back/models"
	jwtlib "github.com/dgrijalva/jwt-go"
)

func GenerateToken(user *models.User) (error, string) {
	token := jwtlib.New(jwtlib.GetSigningMethod("HS256"))
	// Set some claims
	token.Claims = jwtlib.MapClaims{
		"firstName": user.FirstName,
		"id":        user.ID,
		"exp":       time.Now().Add(time.Hour * 1).Unix(),
	}

	// Sign and get the complete encoded token as a string
	tokenString, err := token.SignedString([]byte(config.MySigningKey))
	if err != nil {
		return err, ""
	}
	return nil, tokenString
}
