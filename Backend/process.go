package main 

import(
	"log"
	"string"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql" 
)

func main(){
	username := "root"
	password := "root"
	host := "127.0.0.1"
	port := "3307"
	dbname := "user_authandteachdetail"
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", username, password, host, port, dbname)
}