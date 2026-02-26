package main 

import(
	"log"
	"string"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql" 
)

var ctx = context.Background()

func main(){
	username := "root"
	password := "root"
	host := "127.0.0.1"
	port1 := "3306"
	port2 := "3307"
	port3 := "3308"
	dbname1 := "common_db"
	dbname2:="home_labor_db"
	dbname3:="contractors_master"
	dsn1 := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", username, password, host, port1, dbname1)
	dsn2 := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", username, password, host, port2, dbname2)
	dsn3 := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", username, password, host, port3, dbname3)
	
	// connecting with the common database for all users 
	common,err := sql.Open("mysql", dsn1)
	if err != nil {
		log.Fatal("MySQL connection failed:", err)
	}
	if err := db.Ping(); err != nil {
		log.Fatal("MySQL ping failed:", err)
	}

	// connecting  with the database of homowners and labours
	handlab,err := sql.Open("mysql", dsn2)
	if err != nil {
		log.Fatal("MySQL connection failed:", err)
	}
	if err := db.Ping(); err != nil {
		log.Fatal("MySQL ping failed:", err)
	}

	// connecting with the database of the contractors where their data will only be stored 
	contrator,err := sql.Open("mysql", dsn3)
	if err != nil {
		log.Fatal("MySQL connection failed:", err)
	}
	if err := db.Ping(); err != nil {
		log.Fatal("MySQL ping failed:", err)
	}

	defer common.close()
	defer handlab.close()
	defer contractors.close()
	r := gin.Default() // Logger + Recovery middleware included

	// --- Routes ---
	r.POST("/verify", verify(db, rdb))
	r.POST("/register/details",registerdetails(common,contractors,handlab))
	r.GET("/worker/attendace",)

	// --- Run server ---
	portToUse := "8080"
	log.Printf("Go worker running at :%s\n", portToUse)
	if err := r.Run(":" + portToUse); err != nil {
		log.Fatal("Failed to start Gin server:", err)
	}
	
}

func verify(db *sql.DB, r *redis.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		var data map[string]string

		// Parse JSON body
		if err := c.ShouldBindJSON(&data); err != nil {
			c.JSON(400, gin.H{"error": "invalid JSON"})
			return
		}

		var usrn string
		var query string
		if data["type"] == "email" {
			query = "SELECT email, urollno, pass, account_type, data_stored_in FROM users WHERE email=?"
			parts := strings.Split(data["value"], "@")
			if len(parts) == 2 {
				usrn = parts[0] // extract username from email
			}
		}
		if data["type"] == "roll" {
			query = "SELECT email, urollno, pass, account_type, data_stored_in FROM users WHERE urollno=?"
			usrn = data["value"]
		}

		// Query MySQL
		var email, university_roll_no, pass, acc_type, data_in string
		err := db.QueryRow(query, usrn).Scan(&email, &university_roll_no, &pass, &acc_type, &data_in)
		if err != nil {
			log.Println(err, usrn, data)
			log.Print(err)
			c.JSON(200, gin.H{"exists": false})
			return
		}

		// Store in Redis
		r.HSet(ctx, "user:"+data["value"], "email", email, "unid", university_roll_no, "pass", pass, "acc_type", acc_type)

		// Return success
		c.JSON(200, gin.H{"exists": true})
	}
}