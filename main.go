package main

import (
	"log"

	"github.com/ainara-dev/lat-back/config"
	"github.com/ainara-dev/lat-back/database"
	"github.com/ainara-dev/lat-back/handlers"
	"github.com/gin-gonic/contrib/jwt"
	"github.com/gin-gonic/gin"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

func main() {
	err := database.Connect("localhost", "postgres", "postgres", "Mother1995", 5432)
	if err != nil {
		log.Fatal("Error in database.Connect()")
	}
	defer database.Disconnect()
	// Update - update product's price to 2000
	// db.Model(&product).Update("Price", 2000)

	// // Delete - delete product
	// db.Delete(&product)

	router := gin.Default()
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	api := router.Group("/api")
	{
		api.POST("/addDirectionType", handlers.AddDirectionType)
		api.POST("/getDirectionTypeID", handlers.GetDirectionTypeID)
		api.POST("/register", handlers.RegisterUser)
		api.POST("/login", handlers.LoginUser)
		api.POST("/checkRegister", handlers.CheckRegisterUser)
		api.POST("/createPremise", handlers.CreatePremise)
		api.GET("/getPremises", handlers.GetPremises)
		api.GET("/getResident", handlers.GetResident)
		api.PUT("/updateResidentAndPrice", handlers.UpdateResidentAndPrice)
		api.POST("/createPayment", handlers.CreatePayment)
		api.GET("/getPayments", handlers.GetPayments)
		api.GET("/getResidents", handlers.GetResidents)
		api.Use(jwt.Auth(config.MySigningKey))
		//api.POST("/createTenant", handlers.CreateTenant)
	}

	if err := router.Run(":8080"); err != nil {
		panic(err)
	}
}
