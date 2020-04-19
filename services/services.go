package services

import (
	jwtlib "github.com/dgrijalva/jwt-go"
	"github.com/malikov0216/lat-back/config"
	"github.com/malikov0216/lat-back/models"
	"time"
)

func GenerateToken(user *models.User) (error, string) {
	token := jwtlib.New(jwtlib.GetSigningMethod("HS256"))
	// Set some claims
	token.Claims = jwtlib.MapClaims{
		"firstName": user.FirstName,
		"id": user.ID,
		"exp":     time.Now().Add(time.Hour * 1).Unix(),
	}

	// Sign and get the complete encoded token as a string
	tokenString, err := token.SignedString([]byte(config.MySigningKey))
	if err != nil {
		return err, ""
	}
	return nil, tokenString
}