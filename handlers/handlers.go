package handlers

import (
	"log"
	"strconv"

	"github.com/ainara-dev/lat-back/database"
	"github.com/ainara-dev/lat-back/models"
	"github.com/ainara-dev/lat-back/services"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
)

func CheckRegisterUser(ctx *gin.Context) {
	var user models.User
	err := ctx.ShouldBindJSON(&user)
	if err != nil {
		log.Println(err)
		ctx.JSON(400, gin.H{"status": "error", "result": err.Error()})
	} else {
		if err := database.DB.
			Where(&models.User{Phone: user.Phone}).
			First(&user).Error; gorm.IsRecordNotFoundError(err) {
			ctx.JSON(200, gin.H{"status": "success", "result": nil})
		} else {
			ctx.JSON(400, gin.H{"status": "error", "result": "Пользовтель с таким номером телефона уже существует"})
		}
	}
}

func RegisterUser(ctx *gin.Context) {
	var user models.User
	var directionType models.DirectionType
	err := ctx.ShouldBindJSON(&user)
	if err != nil {
		log.Println(err)
		ctx.JSON(400, gin.H{"status": "error", "result": err.Error()})
	} else {
		log.Println("JSON user:", user)
		database.DB.Where(&models.DirectionType{
			Apartment: user.DirectionType.Apartment,
			Office:    user.DirectionType.Office,
			Boutique:  user.DirectionType.Boutique,
		}).Find(&directionType)
		log.Println("Direction table: ", directionType)
		createUser := models.User{FirstName: user.FirstName, LastName: user.LastName, Phone: user.Phone, Password: user.Password, DirectionId: directionType.ID}
		log.Println("createUser Data: ", createUser)
		database.DB.Create(&createUser)
		err, token := services.GenerateToken(&createUser)
		if err != nil {
			log.Println(err)
			ctx.JSON(500, gin.H{"status": "error", "result": "Ошибка при генерации токена" + err.Error()})
		}
		ctx.JSON(200, gin.H{"status": "success", "token": token})

	}
}

func LoginUser(ctx *gin.Context) {
	var user models.User
	err := ctx.ShouldBindJSON(&user)
	if err != nil {
		log.Println(err)
		ctx.JSON(400, gin.H{"status": "error", "result": err.Error()})
	} else {
		if err := database.DB.
			Where(&models.User{Phone: user.Phone}).
			First(&user).Error; gorm.IsRecordNotFoundError(err) {
			log.Println(err.Error())
			ctx.JSON(400, gin.H{"status": "error", "result": "Номер телефона или пароль не верны!"})
		} else {
			err, token := services.GenerateToken(&user)
			if err != nil {
				log.Println(err)
				ctx.JSON(500, gin.H{"status": "error", "result": "Error has occurred when generating token" + err.Error()})
			}
			ctx.JSON(200, gin.H{"status": "success", "token": token})
		}
	}
}

func AddDirectionType(ctx *gin.Context) {
	var result models.Result
	err := ctx.BindJSON(&result)
	if err != nil {
		log.Println(err)
		ctx.JSON(400, gin.H{"status": "error", "result": err.Error()})
	} else {
		for i := 0; i < len(result.DirectionResult); i++ {
			var directionType models.DirectionType
			directionType = result.DirectionResult[i]
			database.DB.Create(&directionType)
		}
		ctx.JSON(200, gin.H{"result": "success"})
	}
}

func GetDirections(ctx *gin.Context) {
	var directionTypeObj models.DirectionType
	//idParam := ctx.Param("id")
	idParam := ctx.Query("id")
	log.Println("idddd", idParam)
	u64, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		log.Println(err)
	}
	id := uint(u64)
	database.DB.Find(&directionTypeObj, id)
	//for k, v := range directionTypeObj {
	//
	//}
	ctx.JSON(200, gin.H{"result": directionTypeObj})
}
