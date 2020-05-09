package handlers

import (
	"fmt"
	"github.com/ainara-dev/lat-back/database"
	"github.com/ainara-dev/lat-back/models"
	"github.com/ainara-dev/lat-back/services"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"log"
	"strconv"
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

func RegisterUser (ctx *gin.Context) {
	var user models.User
	var directionType models.DirectionType
	if err := ctx.BindJSON(&user); err != nil {
		log.Println(err)
		ctx.JSON(400, gin.H{"status": "error", "result": err.Error()})
	} else {
		fmt.Println("User directionTypeID", user.DirectionTypeID)
		database.DB.Create(&user)

		database.DB.Find(&directionType, user.DirectionTypeID)
		if err, token := services.GenerateToken(&user, &directionType); err != nil {
			log.Println(err)
			ctx.JSON(500, gin.H{"status": "error", "result": "Ошибка при генерации токена" + err.Error()})
		} else {
			ctx.JSON(200, gin.H{"status": "success", "token": token})
		}

	}

}

func GetDirectionTypeID (ctx *gin.Context) {
	var directionType models.DirectionType
	if err := ctx.BindJSON(&directionType); err != nil {
		log.Println(err)
		ctx.JSON(400, gin.H{"status": "error", "result": err.Error()})
	} else {
		if err := database.DB.
			Where(&models.DirectionType{Apartment: directionType.Apartment, Office: directionType.Office, Boutique: directionType.Boutique}).
			Find(&directionType).Error; err != nil {
			log.Println(err)
			ctx.JSON(500, gin.H{"status": "error", "result": err.Error()})
		} else {
			ctx.JSON(200, gin.H{"status": "success", "result": directionType.ID})
		}
	}
}

func LoginUser(ctx *gin.Context) {
	var user models.User
	var directionType models.DirectionType
	err := ctx.ShouldBindJSON(&user)
	if err != nil {
		log.Println(err)
		ctx.JSON(400, gin.H{"status": "error", "result": err.Error()})
	} else {
		if err := database.DB.
			Where(&models.User{Phone: user.Phone, Password: user.Password}).
			First(&user).Error; gorm.IsRecordNotFoundError(err) {
			log.Println(err.Error())
			ctx.JSON(400, gin.H{"status": "error", "result": "Номер телефона или пароль не верны!"})
		} else {
			fmt.Println("User Info:", user.DirectionTypeID)
			database.DB.Find(&directionType, user.DirectionTypeID)
			err, token := services.GenerateToken(&user, &directionType)
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

func CreatePremise(ctx *gin.Context) {
	var createTenant models.CreatePremise
	if err := ctx.BindJSON(&createTenant); err != nil {
		log.Println(err)
		ctx.JSON(400, gin.H{"status": "error", "result": err.Error()})
	} else {
		resident := createTenant.Resident
		if err := database.DB.Create(&resident).Error; err != nil {
			log.Println(err.Error())
			ctx.JSON(500, gin.H{"status": "error", "result": err.Error()})
		} else {
			premise := createTenant.Premise
			premise.ResidentID = resident.ID
			premise.UserID = createTenant.UserID
			if err := database.DB.Create(&premise).Error; err != nil {
				log.Println(err.Error())
				ctx.JSON(500, gin.H{"status": "error", "result": err.Error()})
			} else {
				var premises []models.Premise
				if err := database.DB.Where(&models.Premise{UserID: createTenant.UserID}).Find(&premises).Error; err != nil {
					log.Println(err.Error())
					ctx.JSON(500, gin.H{"status": "error", "result": err.Error()})
				} else {
					ctx.JSON(200, gin.H{"status": "success", "result": premises})
				}
			}
		}
	}
}

func CreatePayment(ctx *gin.Context) {
	var payment models.Payment
	if err := ctx.BindJSON(&payment); err != nil {
		log.Println(err)
		ctx.JSON(400, gin.H{"status": "error", "result": err.Error()})
	} else {
		if err := database.DB.Create(&payment).Error; err != nil {
			log.Println(err.Error())
			ctx.JSON(500, gin.H{"status": "error", "result": err.Error()})
		} else {
			var payments []models.Payment
			if err := database.DB.Where(&models.Payment{ResidentID: payment.ResidentID}).Find(&payments).Error; err != nil {
				log.Println(err.Error())
				ctx.JSON(500, gin.H{"status": "error", "result": err.Error()})
			} else {
				ctx.JSON(200, gin.H{"status": "success", "result": payments})
			}
		}
	}
}

func GetPremises(ctx *gin.Context) {
	idQuery := ctx.Query("id")
	u64, err := strconv.ParseUint(idQuery, 10, 32)
	if err != nil {
		fmt.Println(err)
	}
	id := uint(u64)
	var premises []models.Premise
	if err := database.DB.Where(&models.Premise{UserID: id}).Find(&premises).Error; err != nil {
		log.Println(err.Error())
		ctx.JSON(500, gin.H{"status": "error", "result": err.Error()})
	} else {
		ctx.JSON(200, gin.H{"status": "success", "result": premises})
	}
}

func GetPayments(ctx *gin.Context) {
	idQuery := ctx.Query("residentID")
	u64, err := strconv.ParseUint(idQuery, 10, 32)
	if err != nil {
		fmt.Println(err)
	}
	residentID := uint(u64)
	var payments []models.Payment
	if err := database.DB.Where(&models.Payment{ResidentID: residentID}).Find(&payments).Error; err != nil {
		log.Println(err.Error())
		ctx.JSON(500, gin.H{"status": "error", "result": err.Error()})
	} else {
		ctx.JSON(200, gin.H{"status": "success", "result": payments})
	}
}

func GetResident(ctx *gin.Context) {
	idQuery := ctx.Query("residentID")
	u64, err := strconv.ParseUint(idQuery, 10, 32)
	if err != nil {
		fmt.Println(err)
	}
	id := uint(u64)
	var resident models.Resident
	if err := database.DB.Find(&resident, id).Error; err != nil {
		log.Println(err.Error())
		ctx.JSON(500, gin.H{"status": "error", "result": err.Error()})
	} else {
		ctx.JSON(200, gin.H{"status": "success", "result": resident})
	}
}

func UpdateResidentAndPrice(ctx *gin.Context) {
	var updateResidentAndPrice models.UpdateResidentAndPrice
	if err := ctx.BindJSON(&updateResidentAndPrice); err != nil {
		log.Println(err)
		ctx.JSON(400, gin.H{"status": "error", "result": err.Error()})
	} else {
		resident := updateResidentAndPrice.Resident
		if err := database.DB.Save(&resident).Error; err != nil {
			log.Println(err.Error())
			ctx.JSON(500, gin.H{"status": "error", "result": err.Error()})
		} else {
			premise := updateResidentAndPrice.Premise
			if err := database.DB.Save(&premise).Error; err != nil {
				log.Println(err.Error())
				ctx.JSON(500, gin.H{"status": "error", "result": err.Error()})
			} else {
				ctx.JSON(200, gin.H{"status": "success", "result": updateResidentAndPrice})
			}
		}
	}

}