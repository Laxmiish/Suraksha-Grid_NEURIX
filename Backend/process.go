package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"github.com/robfig/cron/v3"
)

var db *sql.DB

func main() {
	var err error
	username := getEnv("DB_USER", "root")
	password := getEnv("DB_PASS", "root")
	host := getEnv("DB_HOST", "127.0.0.1")
	port := getEnv("DB_PORT", "3306")
	dbName := getEnv("DB_NAME", "suraksha_db")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", username, password, host, port, dbName)

	db, err = sql.Open("mysql", dsn)
	if err != nil || db.Ping() != nil { log.Fatal("Database connection failed:", err) }
	defer db.Close()

	c := cron.New()
	c.AddFunc("0 0 * * *", runDailyAttendancePulse)
	c.Start()

	r := gin.Default()

	r.POST("/register", registerHandler)
	r.POST("/login", loginHandler)
	r.GET("/worker/benefits/:ref_id", getEligibleBenefits)
	r.POST("/contractor/mark-absent", markAbsent)
	r.GET("/worker/union-history/:ref_id", getUnionHistory)
	r.GET("/worker/labour-boards/:ref_id", getLabourBoards)
	r.GET("/worker/profile/:ref_id", getWorkerProfile)

	log.Println("Go Engine running intensely on port 8080")
	r.Run(":8080")
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}

// 1. Unified Registration (Now saving DOB and Gender from the XML)
func registerHandler(c *gin.Context) {
	var data map[string]interface{}
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid JSON"})
		return
	}

	query := `INSERT INTO users (reference_id, name, dob, gender, phone, email, password_hash, role, state, rating) 
			  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 100) 
			  ON DUPLICATE KEY UPDATE phone=?, email=?, password_hash=?, role=?`
			  
	_, err := db.Exec(query, 
		data["reference_id"], data["name"], data["dob"], data["gender"], 
		data["mobile"], data["email"], data["password"], data["role"], data["state"],
		data["mobile"], data["email"], data["password"], data["role"])
		
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register user"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "success"})
}

// 2. Login verification lookup
func loginHandler(c *gin.Context) {
	var data map[string]string
	c.ShouldBindJSON(&data)

	var refID, hash, role, name string
	query := `SELECT reference_id, name, password_hash, role FROM users WHERE phone=?`
	err := db.QueryRow(query, data["mobile"]).Scan(&refID, &name, &hash, &role)
	
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		}
		return
	}
	c.JSON(http.StatusOK, gin.H{"reference_id": refID, "name": name, "password_hash": hash, "role": role})
}

// 3. THE SENIORITY LOGIC
func getEligibleBenefits(c *gin.Context) {
	refID := c.Param("ref_id")

	var totalDays int
	queryDays := `SELECT COUNT(*) FROM attendance_logs WHERE worker_reference_id=? AND status='PRESENT'`
	err := db.QueryRow(queryDays, refID).Scan(&totalDays)
	if err != nil { totalDays = 0 }

	// 90 days of logged work = 1 year of statutory BOCW eligibility
	seniorityYears := totalDays / 90

	var workerState string
	queryState := `SELECT state FROM users WHERE reference_id=?`
	err = db.QueryRow(queryState, refID).Scan(&workerState)
	if err != nil { workerState = "Uttar Pradesh" }

	queryBenefits := `SELECT benifitname, benifittype, minimumyear, conditions 
					  FROM benefits WHERE state=? AND minimumyear <= ?`
	rows, err := db.Query(queryBenefits, workerState, seniorityYears)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch benefits"})
		return
	}
	defer rows.Close()

	var eligibleBenefits []map[string]interface{}
	for rows.Next() {
		var name, bType, conditions string
		var minYear int
		rows.Scan(&name, &bType, &minYear, &conditions)
		eligibleBenefits = append(eligibleBenefits, map[string]interface{}{
			"benefit_name": name, "type": bType, "years_required": minYear, "conditions": conditions,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"seniority_stats": map[string]interface{}{
			"total_days_worked": totalDays,
			"calculated_bocw_years": seniorityYears,
			"days_to_next_tier": 90 - (totalDays % 90),
		},
		"eligible_schemes": eligibleBenefits,
	})
}

// 4. Contractor marks absent
func markAbsent(c *gin.Context) {
	var data map[string]interface{}
	c.ShouldBindJSON(&data)

	query := `UPDATE attendance_logs SET status='ABSENT' WHERE jobsite_id=? AND worker_reference_id=? AND date=?`
	_, err := db.Exec(query, data["jobsite_id"], data["worker_reference_id"], data["date"])
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update attendance"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "Marked Absent"})
}

// 5. Union History
func getUnionHistory(c *gin.Context) {
	refID := c.Param("ref_id")
	query := `SELECT union_name, state, from_date, to_date, benefit_summary, status FROM union_memberships WHERE worker_reference_id=? ORDER BY id`
	rows, err := db.Query(query, refID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch union history"})
		return
	}
	defer rows.Close()
	var unions []map[string]interface{}
	for rows.Next() {
		var name, state, from, to, benefit, status string
		rows.Scan(&name, &state, &from, &to, &benefit, &status)
		unions = append(unions, map[string]interface{}{
			"union_name": name, "state": state, "from": from, "to": to,
			"benefit_summary": benefit, "status": status,
		})
	}
	if unions == nil { unions = []map[string]interface{}{} }
	c.JSON(http.StatusOK, gin.H{"unions": unions})
}

// 6. Labour Board Registrations
func getLabourBoards(c *gin.Context) {
	refID := c.Param("ref_id")
	query := `SELECT board_name, short_name, state, reg_number, from_date, to_date, status, contributions, contact, website, cert_status FROM labour_board_registrations WHERE worker_reference_id=? ORDER BY id`
	rows, err := db.Query(query, refID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch labour boards"})
		return
	}
	defer rows.Close()
	var boards []map[string]interface{}
	for rows.Next() {
		var boardName, shortName, state, regNum, from, to, status, contrib, contact, website, certStatus string
		rows.Scan(&boardName, &shortName, &state, &regNum, &from, &to, &status, &contrib, &contact, &website, &certStatus)
		boards = append(boards, map[string]interface{}{
			"board_name": boardName, "short_name": shortName, "state": state,
			"reg_number": regNum, "from": from, "to": to, "status": status,
			"contributions": contrib, "contact": contact, "website": website,
			"cert_status": certStatus,
		})
	}
	if boards == nil { boards = []map[string]interface{}{} }
	c.JSON(http.StatusOK, gin.H{"labour_boards": boards})
}

// 7. Worker Profile
func getWorkerProfile(c *gin.Context) {
	refID := c.Param("ref_id")
	var name, dob, gender, state, phone, email, role string
	var rating int
	query := `SELECT name, dob, gender, state, phone, email, role, rating FROM users WHERE reference_id=?`
	err := db.QueryRow(query, refID).Scan(&name, &dob, &gender, &state, &phone, &email, &role, &rating)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Worker not found"})
		return
	}
	// Get total days worked
	var totalDays int
	daysQuery := `SELECT COUNT(*) FROM attendance_logs WHERE worker_reference_id=? AND status='PRESENT'`
	db.QueryRow(daysQuery, refID).Scan(&totalDays)

	c.JSON(http.StatusOK, gin.H{
		"reference_id": refID, "name": name, "dob": dob, "gender": gender,
		"state": state, "phone": phone, "email": email, "role": role,
		"rating": rating, "total_days_worked": totalDays,
	})
}

func runDailyAttendancePulse() {
	log.Println("Running Daily Attendance Pulse (Default-Present)...")
	rows, err := db.Query("SELECT jobsite_id, worker_reference_id, daily_wage FROM active_links WHERE active = 1")
	if err != nil { return }
	defer rows.Close()

	insertQuery := `INSERT IGNORE INTO attendance_logs (jobsite_id, worker_reference_id, date, status, payout_amount) VALUES (?, ?, CURDATE(), 'PRESENT', ?)`
	for rows.Next() {
		var jobsiteID int
		var workerID string
		var wage float64
		rows.Scan(&jobsiteID, &workerID, &wage)
		db.Exec(insertQuery, jobsiteID, workerID, wage)
	}
	log.Println("Pulse Complete.")
}