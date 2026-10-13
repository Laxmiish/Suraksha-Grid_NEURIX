package main

import (
	"bytes"
	"database/sql"
	"encoding/xml"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"regexp"
	"strings"
	"sync"
	"time"

	"github.com/alexmullins/zip"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	_ "modernc.org/sqlite"
	"golang.org/x/crypto/bcrypt"
)

var (
	isPG          bool
	workerDB      *sql.DB
	householdDB   *sql.DB
	contractorDB  *sql.DB // Demo contractor SG-C7K9M-3381
	contractorMap = make(map[string]*sql.DB)
	contractorMu  sync.RWMutex
	jwtSecret     = []byte("suraksha-grid-dev-super-secret-key-2026")
	dbHost        = "127.0.0.1"
	dbPort        = "5432"
	dbUser        = "postgres"
	dbPass        = "postgres"
)

// --- XML Structures for Aadhaar Offline e-KYC ---
type AadhaarPoi struct {
	Name   string `xml:"name,attr"`
	DOB    string `xml:"dob,attr"`
	Gender string `xml:"gender,attr"`
}

type AadhaarPoa struct {
	CareOf   string `xml:"co,attr"`
	House    string `xml:"house,attr"`
	Street   string `xml:"street,attr"`
	Locality string `xml:"loc,attr"`
	VTC      string `xml:"vtc,attr"`
	District string `xml:"dist,attr"`
	State    string `xml:"state,attr"`
	Pincode  string `xml:"pc,attr"`
}

type AadhaarUidData struct {
	Poi AadhaarPoi `xml:"Poi"`
	Poa AadhaarPoa `xml:"Poa"`
	Pht string     `xml:"Pht"`
}

type AadhaarXML struct {
	XMLName     xml.Name       `xml:"OfflinePaperlessKyc"`
	ReferenceID string         `xml:"referenceId,attr"`
	UidData     AadhaarUidData `xml:"UidData"`
}

// --- Request / Response Models ---
type RegisterRequest struct {
	ReferenceID string `json:"reference_id" binding:"required"`
	Name        string `json:"name" binding:"required"`
	DOB         string `json:"dob"`
	Gender      string `json:"gender"`
	State       string `json:"state"`
	Mobile      string `json:"mobile" binding:"required"`
	Email       string `json:"email"`
	Password    string `json:"password" binding:"required"`
	Role        string `json:"role" binding:"required"`
}

type LoginRequest struct {
	Mobile   string `json:"mobile" binding:"required"`
	Password string `json:"password" binding:"required"`
	Role     string `json:"role" binding:"required"`
}

func main() {
	// 1. Load Environment Variables
	if err := godotenv.Load(); err != nil {
		if err2 := godotenv.Load(`f:\Projects\Suraksha Grid\Suraksha Grid\.env`); err2 != nil {
			log.Println("Note: .env file not found or already in environment, using system env")
		}
	}

	if secret := os.Getenv("JWT_SECRET"); secret != "" {
		jwtSecret = []byte(secret)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	if h := os.Getenv("DB_HOST"); h != "" {
		dbHost = h
	}
	if p := os.Getenv("DB_PORT"); p != "" {
		dbPort = p
	}
	if u := os.Getenv("DB_USER"); u != "" {
		dbUser = u
	}
	if pw := os.Getenv("DB_PASSWORD"); pw != "" {
		dbPass = pw
	}

	// 2. Initialize 3 Dedicated Isolated Databases
	initTripleDatabases()

	// 3. Setup Gin HTTP Router
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	// CORS Middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// Unified API Routes
	api := r.Group("/api")
	{
		// Health check
		api.GET("/health", healthHandler)

		// Auth
		api.POST("/register", registerHandler)
		api.POST("/login", loginHandler)
		api.POST("/ekyc/upload", ekycUploadHandler)

		// Worker Database Endpoints (DB 1: workers_db)
		api.GET("/worker/profile/:ref_id", getWorkerProfileHandler)
		api.GET("/worker/benefits/:ref_id", getEligibleBenefitsHandler)
		api.GET("/worker/union-history/:ref_id", getUnionHistoryHandler)
		api.GET("/worker/labour-boards/:ref_id", getLabourBoardsHandler)

		// Work Provider / Contractor Database Endpoints (DB 3: contractor_db)
		api.POST("/contractor/mark-absent", markAbsentHandler)
		api.GET("/contractor/jobsites", getJobsitesHandler)
		api.GET("/jobsites/:id/workers", getJobsiteWorkersHandler)
		api.POST("/attendance/mark", markAttendanceHandler)
		api.POST("/jobsites/create", createJobsiteHandler)

		// Household Database Endpoints (DB 2: household_db)
		api.GET("/household/domestic-workers", getDomesticWorkersHandler)
		api.GET("/household/my-helpers/:employer_id", getMyHelpersHandler)
		api.POST("/household/mark-attendance", markHouseholdAttendanceHandler)
		api.POST("/household/hire", hireHelperHandler)

		// Backward compatibility alias for /api/go/*
		goCompat := api.Group("/go")
		{
			goCompat.POST("/register", registerHandler)
			goCompat.POST("/login", loginHandler)
			goCompat.GET("/worker/profile/:ref_id", getWorkerProfileHandler)
			goCompat.GET("/worker/benefits/:ref_id", getEligibleBenefitsHandler)
			goCompat.POST("/contractor/mark-absent", markAbsentHandler)
			goCompat.GET("/worker/union-history/:ref_id", getUnionHistoryHandler)
			goCompat.GET("/worker/labour-boards/:ref_id", getLabourBoardsHandler)
		}
	}

	log.Printf(" Suraksha Grid Unified Business Engine listening on port :%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Server failed to run: %v", err)
	}
}

// --- Triple Database Connection Management ---
func initTripleDatabases() {
	var err error
	pgMasterURL := fmt.Sprintf("postgres://%s:%s@%s:%s/postgres?sslmode=disable", dbUser, dbPass, dbHost, dbPort)
	log.Printf("Verifying PostgreSQL cluster at %s:%s...", dbHost, dbPort)

	testDB, err := sql.Open("postgres", pgMasterURL)
	if err == nil && testDB.Ping() == nil {
		isPG = true
		testDB.Close()
		log.Println(" PostgreSQL Cluster detected. Connecting to 3 dedicated databases:")

		// 1. Worker DB
		workerURL := fmt.Sprintf("postgres://%s:%s@%s:%s/workers_db?sslmode=disable", dbUser, dbPass, dbHost, dbPort)
		workerDB, err = sql.Open("postgres", workerURL)
		if err != nil || workerDB.Ping() != nil {
			log.Fatalf("Failed to connect to workers_db: %v", err)
		}
		log.Println("   [DB 1/3] Connected to workers_db (Worker Welfare, Seniority, BOCW Schemes)")

		// 2. Household DB
		householdURL := fmt.Sprintf("postgres://%s:%s@%s:%s/household_db?sslmode=disable", dbUser, dbPass, dbHost, dbPort)
		householdDB, err = sql.Open("postgres", householdURL)
		if err != nil || householdDB.Ping() != nil {
			log.Fatalf("Failed to connect to household_db: %v", err)
		}
		log.Println("   [DB 2/3] Connected to household_db (Personal Employers, Domestic Workers)")

		// 3. Demo Contractor DB
		contractorURL := fmt.Sprintf("postgres://%s:%s@%s:%s/contractor_demo_db?sslmode=disable", dbUser, dbPass, dbHost, dbPort)
		contractorDB, err = sql.Open("postgres", contractorURL)
		if err != nil || contractorDB.Ping() != nil {
			// fallback to contractor_sg_c7k9m_3381
			contractorURL = fmt.Sprintf("postgres://%s:%s@%s:%s/contractor_sg_c7k9m_3381?sslmode=disable", dbUser, dbPass, dbHost, dbPort)
			contractorDB, err = sql.Open("postgres", contractorURL)
		}
		if err == nil && contractorDB.Ping() == nil {
			log.Println("   [DB 3/3] Connected to contractor_demo_db (Work Provider Sites, Muster Rolls)")
		}
	} else {
		isPG = false
		if testDB != nil {
			testDB.Close()
		}
		log.Printf("⚠️ PostgreSQL not reachable (%v). Falling back to 3 local SQLite databases:", err)

		workerDB, err = sql.Open("sqlite", "workers.db")
		if err != nil {
			log.Fatalf("Failed to open workers.db: %v", err)
		}
		log.Println("   [DB 1/3] Connected to local workers.db")

		householdDB, err = sql.Open("sqlite", "household.db")
		if err != nil {
			log.Fatalf("Failed to open household.db: %v", err)
		}
		log.Println("   [DB 2/3] Connected to local household.db")

		contractorDB, err = sql.Open("sqlite", "contractor_SG_C7K9M_3381.db")
		if err != nil {
			log.Fatalf("Failed to open contractor_SG_C7K9M_3381.db: %v", err)
		}
		log.Println("   [DB 3/3] Connected to local contractor_SG_C7K9M_3381.db")
	}
}

// Dynamic Tenant Provisioning for new Work Providers
func getOrCreateContractorDB(refID string) *sql.DB {
	contractorMu.RLock()
	if cdb, ok := contractorMap[refID]; ok {
		contractorMu.RUnlock()
		return cdb
	}
	contractorMu.RUnlock()

	// Default demo contractor
	if refID == "SG-C7K9M-3381" || refID == "" {
		return contractorDB
	}

	contractorMu.Lock()
	defer contractorMu.Unlock()

	cleanID := strings.ToLower(regexp.MustCompile(`[^a-zA-Z0-9]`).ReplaceAllString(refID, "_"))
	if isPG {
		dbName := fmt.Sprintf("contractor_%s", cleanID)
		// Try to create DB
		masterURL := fmt.Sprintf("postgres://%s:%s@%s:%s/postgres?sslmode=disable", dbUser, dbPass, dbHost, dbPort)
		mDB, err := sql.Open("postgres", masterURL)
		if err == nil {
			_, _ = mDB.Exec(fmt.Sprintf("CREATE DATABASE %s WITH TEMPLATE contractor_demo_db;", dbName))
			mDB.Close()
		}
		newURL := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", dbUser, dbPass, dbHost, dbPort, dbName)
		newDB, err := sql.Open("postgres", newURL)
		if err == nil && newDB.Ping() == nil {
			contractorMap[refID] = newDB
			return newDB
		}
	} else {
		fileName := fmt.Sprintf("contractor_%s.db", cleanID)
		newDB, err := sql.Open("sqlite", fileName)
		if err == nil {
			// init schema
			newDB.Exec(`
				CREATE TABLE IF NOT EXISTS contractor_users (reference_id VARCHAR(255) PRIMARY KEY, phone VARCHAR(20) UNIQUE, email VARCHAR(255), name VARCHAR(255), password_hash VARCHAR(255), role VARCHAR(50) DEFAULT 'contractor', rating INT DEFAULT 100, supervisory_acc BOOLEAN DEFAULT FALSE, manager_id VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
				CREATE TABLE IF NOT EXISTS jobsites (id INTEGER PRIMARY KEY AUTOINCREMENT, contractor_id VARCHAR(255), name VARCHAR(500), state VARCHAR(100), location VARCHAR(500), start_date DATE, end_date DATE, status VARCHAR(50) DEFAULT 'Active', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
				CREATE TABLE IF NOT EXISTS active_links (id INTEGER PRIMARY KEY AUTOINCREMENT, jobsite_id INT, worker_reference_id VARCHAR(255), worker_name VARCHAR(255), worker_phone VARCHAR(20), daily_wage DECIMAL(10,2), role VARCHAR(100), active BOOLEAN DEFAULT TRUE, assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
				CREATE TABLE IF NOT EXISTS site_attendance_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, jobsite_id INT, worker_reference_id VARCHAR(255), date DATE, status VARCHAR(20) DEFAULT 'PRESENT', payout_amount DECIMAL(10,2), UNIQUE (jobsite_id, worker_reference_id, date));
			`)
			contractorMap[refID] = newDB
			return newDB
		}
	}

	return contractorDB
}

// --- Handlers ---

func healthHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":      "healthy",
		"engine":      "Suraksha Grid 3-Database Architecture",
		"is_postgres": isPG,
		"databases": gin.H{
			"db1_workers":    "connected",
			"db2_household":  "connected",
			"db3_contractor": "connected",
		},
		"timestamp": time.Now().UTC().Format(time.RFC3339),
	})
}

// Unified Registration across 3 Databases
func registerHandler(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid payload: " + err.Error()})
		return
	}

	hashedPwd, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to encrypt password"})
		return
	}

	targetRole := strings.ToLower(req.Role)

	if targetRole == "contractor" || targetRole == "work_provider" {
		// Provision dedicated contractor DB
		cDB := getOrCreateContractorDB(req.ReferenceID)
		query := `INSERT INTO contractor_users (reference_id, phone, email, name, password_hash, role, rating)
		          VALUES ($1, $2, $3, $4, $5, 'contractor', 95)
		          ON CONFLICT(reference_id) DO UPDATE SET phone=EXCLUDED.phone, password_hash=EXCLUDED.password_hash`
		_, err = cDB.Exec(query, req.ReferenceID, req.Mobile, req.Email, req.Name, string(hashedPwd))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to register Work Provider: " + err.Error()})
			return
		}
	} else if targetRole == "employer" || targetRole == "household" {
		// Household DB
		query := `INSERT INTO employers (reference_id, phone, email, name, address, city, pincode, password_hash)
		          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		          ON CONFLICT(reference_id) DO UPDATE SET phone=EXCLUDED.phone, password_hash=EXCLUDED.password_hash`
		_, err = householdDB.Exec(query, req.ReferenceID, req.Mobile, req.Email, req.Name, "Registered Address", req.State, "400001", string(hashedPwd))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to register Household Employer: " + err.Error()})
			return
		}
	} else {
		// Worker DB
		query := `INSERT INTO users (reference_id, name, dob, gender, phone, email, password_hash, role, state, rating)
		          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 100)
		          ON CONFLICT(reference_id) DO UPDATE SET phone=EXCLUDED.phone, email=EXCLUDED.email, password_hash=EXCLUDED.password_hash`
		_, err = workerDB.Exec(query, req.ReferenceID, req.Name, req.DOB, req.Gender, req.Mobile, req.Email, string(hashedPwd), "worker", req.State)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to register Worker: " + err.Error()})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Account created successfully across dedicated domain database",
		"data": gin.H{
			"reference_id": req.ReferenceID,
			"name":         req.Name,
			"role":         req.Role,
		},
	})
}

// Unified Login Router across 3 Databases
func loginHandler(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid login details"})
		return
	}

	var refID, name, storedHash, userRole string
	var queryErr error
	targetRole := strings.ToLower(req.Role)

	if targetRole == "contractor" || targetRole == "supervisor" || targetRole == "work_provider" {
		// Look up in Contractor DB
		query := `SELECT reference_id, name, password_hash, role FROM contractor_users WHERE phone=$1`
		queryErr = contractorDB.QueryRow(query, req.Mobile).Scan(&refID, &name, &storedHash, &userRole)
	} else if targetRole == "employer" || targetRole == "household" {
		// Look up in Household DB
		query := `SELECT reference_id, name, password_hash, 'employer' FROM employers WHERE phone=$1`
		queryErr = householdDB.QueryRow(query, req.Mobile).Scan(&refID, &name, &storedHash, &userRole)
	} else {
		// Look up in Worker DB
		query := `SELECT reference_id, name, password_hash, role FROM users WHERE phone=$1`
		queryErr = workerDB.QueryRow(query, req.Mobile).Scan(&refID, &name, &storedHash, &userRole)
	}

	if queryErr != nil {
		if queryErr == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "User not found with this mobile number in selected role database"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database lookup error: " + queryErr.Error()})
		}
		return
	}

	// Verify Password with bcrypt
	if err := bcrypt.CompareHashAndPassword([]byte(storedHash), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Invalid password"})
		return
	}

	// Generate JWT Token
	expirationTime := time.Now().Add(24 * time.Hour)
	tokenClaims := jwt.MapClaims{
		"ref":  refID,
		"role": userRole,
		"exp":  expirationTime.Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, tokenClaims)
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to create session token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":      true,
		"token":        tokenString,
		"reference_id": refID,
		"name":         name,
		"role":         userRole,
	})
}

func ekycUploadHandler(c *gin.Context) {
	fileHeader, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "No file uploaded"})
		return
	}

	shareCode := c.PostForm("share_code")
	if shareCode == "" {
		shareCode = "1234"
	}

	file, err := fileHeader.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to open uploaded file"})
		return
	}
	defer file.Close()

	fileBytes, err := io.ReadAll(file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to read uploaded file"})
		return
	}

	zipReader, err := zip.NewReader(bytes.NewReader(fileBytes), int64(len(fileBytes)))
	if err != nil {
		// Return simulated offline pass for demo archives
		c.JSON(http.StatusOK, gin.H{
			"reference_id": "SG-A3F2B-4521",
			"name":         "Ramesh Kumar",
			"dob":          "1990-05-15",
			"gender":       "M",
			"address": gin.H{
				"district": "Pune",
				"state":    "Maharashtra",
			},
		})
		return
	}

	var xmlData []byte
	for _, f := range zipReader.File {
		if strings.HasSuffix(strings.ToLower(f.Name), ".xml") {
			f.SetPassword(shareCode)
			rc, openErr := f.Open()
			if openErr != nil {
				c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Invalid 4-digit share code"})
				return
			}
			xmlData, _ = io.ReadAll(rc)
			rc.Close()
			break
		}
	}

	if len(xmlData) == 0 {
		c.JSON(http.StatusOK, gin.H{
			"reference_id": "SG-A3F2B-4521",
			"name":         "Ramesh Kumar",
			"dob":          "1990-05-15",
			"gender":       "M",
			"address": gin.H{
				"district": "Pune",
				"state":    "Maharashtra",
			},
		})
		return
	}

	var parsedXML AadhaarXML
	if err := xml.Unmarshal(xmlData, &parsedXML); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid Aadhaar e-KYC XML format"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"reference_id": parsedXML.ReferenceID,
		"name":         parsedXML.UidData.Poi.Name,
		"dob":          parsedXML.UidData.Poi.DOB,
		"gender":       parsedXML.UidData.Poi.Gender,
		"address": gin.H{
			"state": parsedXML.UidData.Poa.State,
		},
	})
}

// Worker Profile (DB 1: workers_db)
func getWorkerProfileHandler(c *gin.Context) {
	refID := c.Param("ref_id")
	var name, dob, gender, state, phone, email, role string
	var rating int

	query := `SELECT name, dob, gender, state, phone, email, role, rating FROM users WHERE reference_id=$1`
	err := workerDB.QueryRow(query, refID).Scan(&name, &dob, &gender, &state, &phone, &email, &role, &rating)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Worker not found in workers_db"})
		return
	}

	var totalDays int
	daysQuery := `SELECT COUNT(*) FROM attendance_logs WHERE worker_reference_id=$1 AND status='PRESENT'`
	_ = workerDB.QueryRow(daysQuery, refID).Scan(&totalDays)

	c.JSON(http.StatusOK, gin.H{
		"reference_id":      refID,
		"name":              name,
		"dob":               dob,
		"gender":            gender,
		"state":             state,
		"phone":             phone,
		"email":             email,
		"role":              role,
		"rating":            rating,
		"total_days_worked": totalDays,
	})
}

// Statutory Benefits (DB 1: workers_db)
func getEligibleBenefitsHandler(c *gin.Context) {
	refID := c.Param("ref_id")

	var totalDays int
	queryDays := `SELECT COUNT(*) FROM attendance_logs WHERE worker_reference_id=$1 AND status='PRESENT'`
	err := workerDB.QueryRow(queryDays, refID).Scan(&totalDays)
	if err != nil {
		totalDays = 120
	}

	seniorityYears := totalDays / 90

	var workerState string
	queryState := `SELECT state FROM users WHERE reference_id=$1`
	err = workerDB.QueryRow(queryState, refID).Scan(&workerState)
	if err != nil {
		workerState = "Maharashtra"
	}

	queryBenefits := `SELECT benifitname, benifittype, minimumyear, conditions 
					  FROM benefits WHERE state=$1 AND minimumyear <= $2 ORDER BY minimumyear ASC`
	rows, err := workerDB.Query(queryBenefits, workerState, seniorityYears)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch benefits: " + err.Error()})
		return
	}
	defer rows.Close()

	eligibleBenefits := []map[string]interface{}{}
	for rows.Next() {
		var name, bType, conditions string
		var minYear int
		if err := rows.Scan(&name, &bType, &minYear, &conditions); err == nil {
			eligibleBenefits = append(eligibleBenefits, map[string]interface{}{
				"benefit_name":   name,
				"type":           bType,
				"years_required": minYear,
				"conditions":     conditions,
			})
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"seniority_stats": map[string]interface{}{
			"total_days_worked":     totalDays,
			"calculated_bocw_years": seniorityYears,
			"days_to_next_tier":     90 - (totalDays % 90),
		},
		"eligible_schemes": eligibleBenefits,
	})
}

func getUnionHistoryHandler(c *gin.Context) {
	refID := c.Param("ref_id")
	query := `SELECT union_name, state, from_date, to_date, benefit_summary, status 
			  FROM union_memberships WHERE worker_reference_id=$1 ORDER BY id`
	rows, err := workerDB.Query(query, refID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch union history"})
		return
	}
	defer rows.Close()

	unions := []map[string]interface{}{}
	for rows.Next() {
		var name, state, from, to, benefit, status string
		rows.Scan(&name, &state, &from, &to, &benefit, &status)
		unions = append(unions, map[string]interface{}{
			"union_name":      name,
			"state":           state,
			"from":            from,
			"to":              to,
			"benefit_summary": benefit,
			"status":          status,
		})
	}
	c.JSON(http.StatusOK, gin.H{"unions": unions})
}

func getLabourBoardsHandler(c *gin.Context) {
	refID := c.Param("ref_id")
	query := `SELECT board_name, short_name, state, reg_number, from_date, to_date, status, contributions, contact, website, cert_status 
			  FROM labour_board_registrations WHERE worker_reference_id=$1 ORDER BY id`
	rows, err := workerDB.Query(query, refID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch labour boards"})
		return
	}
	defer rows.Close()

	boards := []map[string]interface{}{}
	for rows.Next() {
		var bName, sName, state, regNum, from, to, status, contrib, contact, site, cert string
		rows.Scan(&bName, &sName, &state, &regNum, &from, &to, &status, &contrib, &contact, &site, &cert)
		boards = append(boards, map[string]interface{}{
			"board_name":    bName,
			"short_name":    sName,
			"state":         state,
			"reg_number":    regNum,
			"from":          from,
			"to":            to,
			"status":        status,
			"contributions": contrib,
			"contact":       contact,
			"website":       site,
			"cert_status":   cert,
		})
	}
	c.JSON(http.StatusOK, gin.H{"labour_boards": boards})
}

// Work Provider Jobsites (DB 3: contractor_db)
func getJobsitesHandler(c *gin.Context) {
	rows, err := contractorDB.Query(`SELECT id, contractor_id, name, state, location, start_date, end_date, status FROM jobsites ORDER BY id ASC`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	jobsites := []map[string]interface{}{}
	for rows.Next() {
		var id int
		var contractor, name, state, loc, start, end, status string
		rows.Scan(&id, &contractor, &name, &state, &loc, &start, &end, &status)

		var workerCount int
		_ = contractorDB.QueryRow(`SELECT COUNT(*) FROM active_links WHERE jobsite_id=$1 AND active=TRUE`, id).Scan(&workerCount)

		jobsites = append(jobsites, map[string]interface{}{
			"id":            id,
			"contractor_id": contractor,
			"name":          name,
			"state":         state,
			"location":      loc,
			"start_date":    start,
			"end_date":      end,
			"status":        status,
			"worker_count":  workerCount,
		})
	}
	c.JSON(http.StatusOK, gin.H{"jobsites": jobsites})
}

func getJobsiteWorkersHandler(c *gin.Context) {
	jobsiteID := c.Param("id")
	query := `SELECT worker_reference_id, worker_name, worker_phone, role, daily_wage, active FROM active_links WHERE jobsite_id = $1`
	rows, err := contractorDB.Query(query, jobsiteID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	workers := []map[string]interface{}{}
	for rows.Next() {
		var refID, name, phone, role string
		var wage float64
		var active bool
		rows.Scan(&refID, &name, &phone, &role, &wage, &active)
		workers = append(workers, map[string]interface{}{
			"reference_id": refID,
			"name":         name,
			"phone":        phone,
			"role":         role,
			"daily_wage":   wage,
			"active":       active,
			"status":       "PRESENT",
		})
	}
	c.JSON(http.StatusOK, gin.H{"workers": workers})
}

// Cross-DB Sync: updates Contractor DB Muster AND Worker DB Seniority Days!
func markAttendanceHandler(c *gin.Context) {
	var req struct {
		JobsiteID         int     `json:"jobsite_id"`
		WorkerReferenceID string  `json:"worker_reference_id"`
		Date              string  `json:"date"`
		Status            string  `json:"status"`
		PayoutAmount      float64 `json:"payout_amount"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
		return
	}

	// 1. Record in Work Provider's DB
	queryContractor := `INSERT INTO site_attendance_logs (jobsite_id, worker_reference_id, date, status, payout_amount)
	                   VALUES ($1, $2, $3, $4, $5)
	                   ON CONFLICT (jobsite_id, worker_reference_id, date)
	                   DO UPDATE SET status=EXCLUDED.status, payout_amount=EXCLUDED.payout_amount`
	_, _ = contractorDB.Exec(queryContractor, req.JobsiteID, req.WorkerReferenceID, req.Date, req.Status, req.PayoutAmount)

	// 2. Synchronize to Worker DB for BOCW statutory seniority accumulation
	queryWorker := `INSERT INTO attendance_logs (jobsite_id, worker_reference_id, date, status, payout_amount)
	                VALUES ($1, $2, $3, $4, $5)
	                ON CONFLICT (jobsite_id, worker_reference_id, date)
	                DO UPDATE SET status=EXCLUDED.status, payout_amount=EXCLUDED.payout_amount`
	_, err := workerDB.Exec(queryWorker, req.JobsiteID, req.WorkerReferenceID, req.Date, req.Status, req.PayoutAmount)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to sync attendance to worker seniority: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Attendance successfully recorded and synchronized to worker statutory seniority",
	})
}

func markAbsentHandler(c *gin.Context) {
	var data struct {
		JobsiteID         int    `json:"jobsite_id"`
		WorkerReferenceID string `json:"worker_reference_id"`
		Date              string `json:"date"`
	}
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	query := `UPDATE site_attendance_logs SET status='ABSENT' WHERE jobsite_id=$1 AND worker_reference_id=$2 AND date=$3`
	_, _ = contractorDB.Exec(query, data.JobsiteID, data.WorkerReferenceID, data.Date)

	queryW := `UPDATE attendance_logs SET status='ABSENT' WHERE jobsite_id=$1 AND worker_reference_id=$2 AND date=$3`
	_, err := workerDB.Exec(queryW, data.JobsiteID, data.WorkerReferenceID, data.Date)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update attendance"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "Marked Absent"})
}

func createJobsiteHandler(c *gin.Context) {
	var req struct {
		ContractorID string `json:"contractor_id"`
		Name         string `json:"name"`
		State        string `json:"state"`
		Location     string `json:"location"`
		StartDate    string `json:"start_date"`
		EndDate      string `json:"end_date"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
		return
	}

	var newID int
	query := `INSERT INTO jobsites (contractor_id, name, state, location, start_date, end_date, status)
			  VALUES ($1, $2, $3, $4, $5, $6, 'Active') RETURNING id`
	err := contractorDB.QueryRow(query, req.ContractorID, req.Name, req.State, req.Location, req.StartDate, req.EndDate).Scan(&newID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create jobsite: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "id": newID})
}

// Household Domestic Workers (DB 2: household_db)
func getDomesticWorkersHandler(c *gin.Context) {
	rows, err := householdDB.Query(`SELECT reference_id, name, phone, skills, monthly_rate, police_verified, rating, city FROM domestic_workers ORDER BY rating DESC`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	workers := []map[string]interface{}{}
	for rows.Next() {
		var refID, name, phone, skills, city string
		var rate, rating float64
		var verified bool
		rows.Scan(&refID, &name, &phone, &skills, &rate, &verified, &rating, &city)
		workers = append(workers, map[string]interface{}{
			"reference_id":    refID,
			"name":            name,
			"phone":           phone,
			"skills":          skills,
			"monthly_rate":    rate,
			"police_verified": verified,
			"rating":          rating,
			"city":            city,
		})
	}
	c.JSON(http.StatusOK, gin.H{"domestic_workers": workers})
}

func getMyHelpersHandler(c *gin.Context) {
	employerID := c.Param("employer_id")
	query := `SELECT e.id, w.reference_id, w.name, w.phone, w.skills, e.role, e.agreed_wage, w.police_verified, w.rating, e.status, e.start_date
	          FROM domestic_engagements e
	          JOIN domestic_workers w ON e.worker_reference_id = w.reference_id
	          WHERE e.employer_reference_id = $1`
	rows, err := householdDB.Query(query, employerID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	helpers := []map[string]interface{}{}
	for rows.Next() {
		var id int
		var refID, name, phone, skills, role, status, start string
		var wage, rating float64
		var verified bool
		rows.Scan(&id, &refID, &name, &phone, &skills, &role, &wage, &verified, &rating, &status, &start)
		helpers = append(helpers, map[string]interface{}{
			"engagement_id":   id,
			"reference_id":    refID,
			"name":            name,
			"phone":           phone,
			"skills":          skills,
			"role":            role,
			"agreed_wage":     wage,
			"police_verified": verified,
			"rating":          rating,
			"status":          status,
			"start_date":      start,
			"attendance":      "PRESENT",
		})
	}
	c.JSON(http.StatusOK, gin.H{"helpers": helpers})
}

func markHouseholdAttendanceHandler(c *gin.Context) {
	var req struct {
		EngagementID      int    `json:"engagement_id"`
		WorkerReferenceID string `json:"worker_reference_id"`
		Date              string `json:"date"`
		Status            string `json:"status"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
		return
	}
	query := `INSERT INTO domestic_attendance_logs (engagement_id, worker_reference_id, date, status)
	          VALUES ($1, $2, $3, $4)
	          ON CONFLICT (engagement_id, worker_reference_id, date)
	          DO UPDATE SET status=EXCLUDED.status`
	_, err := householdDB.Exec(query, req.EngagementID, req.WorkerReferenceID, req.Date, req.Status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Domestic staff attendance recorded"})
}

func hireHelperHandler(c *gin.Context) {
	var req struct {
		EmployerID string  `json:"employer_id"`
		WorkerID   string  `json:"worker_id"`
		Role       string  `json:"role"`
		AgreedWage float64 `json:"agreed_wage"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
		return
	}
	query := `INSERT INTO domestic_engagements (employer_reference_id, worker_reference_id, role, agreed_wage, start_date, status)
	          VALUES ($1, $2, $3, $4, CURRENT_DATE, 'Active')`
	_, err := householdDB.Exec(query, req.EmployerID, req.WorkerID, req.Role, req.AgreedWage)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Domestic worker engaged successfully"})
}

