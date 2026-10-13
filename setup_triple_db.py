import sqlite3
import subprocess
import os

print("=== Setting up 3 Dedicated Databases for Suraksha Grid ===")

# --- 1. PostgreSQL Provisioning ---
def run_pg_cmd(cmd):
    full_cmd = f'docker exec suraksha-postgres psql -U postgres -c "{cmd}"'
    res = subprocess.run(full_cmd, shell=True, capture_output=True, text=True)
    return res.returncode == 0, res.stdout, res.stderr

def run_pg_sql(db_name, sql):
    # write temp sql
    tmp_path = f"tmp_{db_name}.sql"
    with open(tmp_path, "w", encoding="utf-8") as f:
        f.write(sql)
    subprocess.run(f'docker cp {tmp_path} suraksha-postgres:/tmp/{tmp_path}', shell=True, capture_output=True)
    res = subprocess.run(f'docker exec suraksha-postgres psql -U postgres -d {db_name} -f /tmp/{tmp_path}', shell=True, capture_output=True, text=True)
    if os.path.exists(tmp_path):
        os.remove(tmp_path)
    return res.returncode == 0, res.stdout, res.stderr

# Create PG databases if not exist
for db in ["workers_db", "household_db", "contractor_SG_C7K9M_3381"]:
    run_pg_cmd(f"CREATE DATABASE {db};")

# --- 2. Schemas & Seed Data ---
bcrypt_hash = "$2b$12$cAmLfONmj24RgO/D4soPeuleumAMinHo7t1XC10arPfkFaKvtYmQy" # demo1234

# 1. WORKERS DB
workers_pg_sql = f"""
CREATE TABLE IF NOT EXISTS users (
    reference_id VARCHAR(255) PRIMARY KEY,
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(255),
    name VARCHAR(255),
    dob VARCHAR(20),
    gender VARCHAR(10),
    state VARCHAR(100),
    address TEXT,
    password_hash VARCHAR(255),
    role VARCHAR(50) DEFAULT 'worker',
    rating INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS benefits (
    id SERIAL PRIMARY KEY,
    state VARCHAR(200),
    benifitname VARCHAR(500),
    benifittype VARCHAR(100),
    minimumyear INT DEFAULT 0,
    workdays INT DEFAULT 0,
    conditions TEXT
);

CREATE TABLE IF NOT EXISTS attendance_logs (
    id SERIAL PRIMARY KEY,
    jobsite_id INT,
    worker_reference_id VARCHAR(255),
    date DATE,
    status VARCHAR(20) DEFAULT 'PRESENT',
    payout_amount DECIMAL(10,2),
    UNIQUE (jobsite_id, worker_reference_id, date)
);

CREATE TABLE IF NOT EXISTS union_memberships (
    id SERIAL PRIMARY KEY,
    worker_reference_id VARCHAR(255),
    union_name VARCHAR(500),
    state VARCHAR(100),
    from_date VARCHAR(20),
    to_date VARCHAR(20),
    benefit_summary VARCHAR(500),
    status VARCHAR(50) DEFAULT 'Active'
);

CREATE TABLE IF NOT EXISTS labour_board_registrations (
    id SERIAL PRIMARY KEY,
    worker_reference_id VARCHAR(255),
    board_name VARCHAR(500),
    short_name VARCHAR(200),
    state VARCHAR(100),
    reg_number VARCHAR(255),
    from_date VARCHAR(20),
    to_date VARCHAR(20),
    status VARCHAR(50) DEFAULT 'Active',
    contributions VARCHAR(500),
    contact VARCHAR(100),
    website VARCHAR(255),
    cert_status VARCHAR(100)
);

-- Seed Worker
INSERT INTO users (reference_id, phone, email, name, dob, gender, state, password_hash, role, rating)
VALUES ('SG-A3F2B-4521', '9876543210', 'ramesh@demo.in', 'Ramesh Kumar', '1990-05-15', 'M', 'Maharashtra', '{bcrypt_hash}', 'worker', 95)
ON CONFLICT (reference_id) DO UPDATE SET password_hash=EXCLUDED.password_hash;
"""

# 2. HOUSEHOLD DB
household_pg_sql = f"""
CREATE TABLE IF NOT EXISTS employers (
    reference_id VARCHAR(255) PRIMARY KEY,
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(255),
    name VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    pincode VARCHAR(10),
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS domestic_workers (
    id SERIAL PRIMARY KEY,
    reference_id VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    phone VARCHAR(20),
    skills VARCHAR(255),
    monthly_rate DECIMAL(10,2),
    police_verified BOOLEAN DEFAULT TRUE,
    rating DECIMAL(3,2) DEFAULT 4.8,
    city VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS domestic_engagements (
    id SERIAL PRIMARY KEY,
    employer_reference_id VARCHAR(255),
    worker_reference_id VARCHAR(255),
    role VARCHAR(100),
    agreed_wage DECIMAL(10,2),
    start_date DATE,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS domestic_attendance_logs (
    id SERIAL PRIMARY KEY,
    engagement_id INT,
    worker_reference_id VARCHAR(255),
    date DATE,
    status VARCHAR(20) DEFAULT 'PRESENT',
    notes TEXT,
    UNIQUE (engagement_id, worker_reference_id, date)
);

-- Seed Household Employer & Domestic Workers
INSERT INTO employers (reference_id, phone, email, name, address, city, pincode, password_hash)
VALUES ('SG-H1P8Q-9012', '9876543220', 'priya@home.in', 'Priya Sharma (Household)', 'Flat 402, Green Acres, Bandra West', 'Mumbai', '400050', '{bcrypt_hash}')
ON CONFLICT (reference_id) DO NOTHING;

INSERT INTO domestic_workers (reference_id, name, phone, skills, monthly_rate, police_verified, rating, city)
VALUES 
('SG-DW01-1101', 'Sunita Bai', '9876540001', 'Cook, Housekeeping', 8500.00, TRUE, 4.9, 'Mumbai'),
('SG-DW02-1102', 'Mahesh Yadav', '9876540002', 'Driver, Chauffeur', 18000.00, TRUE, 4.8, 'Mumbai'),
('SG-DW03-1103', 'Geeta Devi', '9876540003', 'Babysitter, Elder Care', 12000.00, TRUE, 4.7, 'Pune')
ON CONFLICT (reference_id) DO NOTHING;

INSERT INTO domestic_engagements (employer_reference_id, worker_reference_id, role, agreed_wage, start_date, status)
VALUES ('SG-H1P8Q-9012', 'SG-DW01-1101', 'Cook & Housekeeping', 8500.00, '2025-01-01', 'Active')
ON CONFLICT DO NOTHING;
"""

# 3. CONTRACTOR DB (Demo contractor SG-C7K9M-3381)
contractor_pg_sql = f"""
CREATE TABLE IF NOT EXISTS contractor_users (
    reference_id VARCHAR(255) PRIMARY KEY,
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(255),
    name VARCHAR(255),
    password_hash VARCHAR(255),
    role VARCHAR(50) DEFAULT 'contractor',
    rating INT DEFAULT 100,
    supervisory_acc BOOLEAN DEFAULT FALSE,
    manager_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jobsites (
    id SERIAL PRIMARY KEY,
    contractor_id VARCHAR(255),
    name VARCHAR(500),
    state VARCHAR(100),
    location VARCHAR(500),
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS active_links (
    id SERIAL PRIMARY KEY,
    jobsite_id INT,
    worker_reference_id VARCHAR(255),
    worker_name VARCHAR(255),
    worker_phone VARCHAR(20),
    daily_wage DECIMAL(10,2),
    role VARCHAR(100),
    active BOOLEAN DEFAULT TRUE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_attendance_logs (
    id SERIAL PRIMARY KEY,
    jobsite_id INT,
    worker_reference_id VARCHAR(255),
    date DATE,
    status VARCHAR(20) DEFAULT 'PRESENT',
    payout_amount DECIMAL(10,2),
    UNIQUE (jobsite_id, worker_reference_id, date)
);

-- Seed Contractor & Supervisor
INSERT INTO contractor_users (reference_id, phone, email, name, password_hash, role, rating, supervisory_acc, manager_id)
VALUES 
('SG-C7K9M-3381', '9876543211', 'sunil@demo.in', 'Sunil Mehta', '{bcrypt_hash}', 'contractor', 92, FALSE, NULL),
('SG-S4R7N-2291', '9876543212', 'rajesh@demo.in', 'Rajesh Sharma', '{bcrypt_hash}', 'supervisor', 88, TRUE, 'SG-C7K9M-3381')
ON CONFLICT (reference_id) DO UPDATE SET password_hash=EXCLUDED.password_hash;

INSERT INTO jobsites (id, contractor_id, name, state, location, start_date, end_date, status)
VALUES 
(1, 'SG-C7K9M-3381', 'NH-48 Highway Expansion', 'Maharashtra', 'Pune, Hinjewadi Bypass Road', '2025-01-15', '2026-12-31', 'Active'),
(2, 'SG-C7K9M-3381', 'Residential Complex Block-B', 'Maharashtra', 'Mumbai, Andheri East, LBS Marg', '2025-06-01', '2027-03-31', 'Active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO active_links (id, jobsite_id, worker_reference_id, worker_name, worker_phone, daily_wage, role, active)
VALUES (1, 1, 'SG-A3F2B-4521', 'Ramesh Kumar', '9876543210', 600, 'Mason', TRUE)
ON CONFLICT (id) DO NOTHING;
"""

print("1. Applying to PostgreSQL...")
run_pg_sql("workers_db", workers_pg_sql)
run_pg_sql("household_db", household_pg_sql)
run_pg_sql("contractor_SG_C7K9M_3381", contractor_pg_sql)

# Also copy benefits & attendance logs into workers_db from seed_postgres.sql
with open("seed_postgres.sql", "r", encoding="utf-8") as f:
    full_seed = f.read()

# Execute full seed on workers_db to populate benefits, union, and labour boards
run_pg_sql("workers_db", full_seed)

print("2. Generating SQLite Local Replicas for zero-docker / offline mode...")
# Workers SQLite
con_w = sqlite3.connect("workers.db")
con_w.executescript("""
CREATE TABLE IF NOT EXISTS users (
    reference_id VARCHAR(255) PRIMARY KEY,
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(255),
    name VARCHAR(255),
    dob VARCHAR(20),
    gender VARCHAR(10),
    state VARCHAR(100),
    address TEXT,
    password_hash VARCHAR(255),
    role VARCHAR(50) DEFAULT 'worker',
    rating INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS benefits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    state VARCHAR(200),
    benifitname VARCHAR(500),
    benifittype VARCHAR(100),
    minimumyear INT DEFAULT 0,
    workdays INT DEFAULT 0,
    conditions TEXT
);
CREATE TABLE IF NOT EXISTS attendance_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jobsite_id INT,
    worker_reference_id VARCHAR(255),
    date DATE,
    status VARCHAR(20) DEFAULT 'PRESENT',
    payout_amount DECIMAL(10,2),
    UNIQUE (jobsite_id, worker_reference_id, date)
);
CREATE TABLE IF NOT EXISTS union_memberships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    worker_reference_id VARCHAR(255),
    union_name VARCHAR(500),
    state VARCHAR(100),
    from_date VARCHAR(20),
    to_date VARCHAR(20),
    benefit_summary VARCHAR(500),
    status VARCHAR(50) DEFAULT 'Active'
);
CREATE TABLE IF NOT EXISTS labour_board_registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    worker_reference_id VARCHAR(255),
    board_name VARCHAR(500),
    short_name VARCHAR(200),
    state VARCHAR(100),
    reg_number VARCHAR(255),
    from_date VARCHAR(20),
    to_date VARCHAR(20),
    status VARCHAR(50) DEFAULT 'Active',
    contributions VARCHAR(500),
    contact VARCHAR(100),
    website VARCHAR(255),
    cert_status VARCHAR(100)
);
""")

# Copy benefits, attendance, unions from suraksha.db if exists
if os.path.exists("suraksha.db"):
    src = sqlite3.connect("suraksha.db")
    for row in src.execute("SELECT reference_id, phone, email, name, dob, gender, state, address, password_hash, role, rating, created_at FROM users WHERE role='worker'").fetchall():
        con_w.execute("INSERT OR REPLACE INTO users VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", row)
    for row in src.execute("SELECT * FROM benefits").fetchall():
        con_w.execute("INSERT OR IGNORE INTO benefits VALUES (?,?,?,?,?,?,?)", row)
    for row in src.execute("SELECT * FROM attendance_logs").fetchall():
        con_w.execute("INSERT OR IGNORE INTO attendance_logs VALUES (?,?,?,?,?,?)", row)
    for row in src.execute("SELECT * FROM union_memberships").fetchall():
        con_w.execute("INSERT OR IGNORE INTO union_memberships VALUES (?,?,?,?,?,?,?,?)", row)
    for row in src.execute("SELECT * FROM labour_board_registrations").fetchall():
        con_w.execute("INSERT OR IGNORE INTO labour_board_registrations VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", row)
    src.close()
con_w.commit()
con_w.close()

# Household SQLite
con_h = sqlite3.connect("household.db")
con_h.executescript(f"""
CREATE TABLE IF NOT EXISTS employers (
    reference_id VARCHAR(255) PRIMARY KEY,
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(255),
    name VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    pincode VARCHAR(10),
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS domestic_workers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reference_id VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    phone VARCHAR(20),
    skills VARCHAR(255),
    monthly_rate DECIMAL(10,2),
    police_verified BOOLEAN DEFAULT TRUE,
    rating DECIMAL(3,2) DEFAULT 4.8,
    city VARCHAR(100)
);
CREATE TABLE IF NOT EXISTS domestic_engagements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employer_reference_id VARCHAR(255),
    worker_reference_id VARCHAR(255),
    role VARCHAR(100),
    agreed_wage DECIMAL(10,2),
    start_date DATE,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT OR IGNORE INTO employers VALUES ('SG-H1P8Q-9012', '9876543220', 'priya@home.in', 'Priya Sharma (Household)', 'Flat 402, Green Acres, Bandra West', 'Mumbai', '400050', '{bcrypt_hash}', CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO domestic_workers VALUES 
(1, 'SG-DW01-1101', 'Sunita Bai', '9876540001', 'Cook, Housekeeping', 8500.00, 1, 4.9, 'Mumbai'),
(2, 'SG-DW02-1102', 'Mahesh Yadav', '9876540002', 'Driver, Chauffeur', 18000.00, 1, 4.8, 'Mumbai'),
(3, 'SG-DW03-1103', 'Geeta Devi', '9876540003', 'Babysitter, Elder Care', 12000.00, 1, 4.7, 'Pune');
""")
con_h.commit()
con_h.close()

# Contractor SQLite
con_c = sqlite3.connect("contractor_SG_C7K9M_3381.db")
con_c.executescript(f"""
CREATE TABLE IF NOT EXISTS contractor_users (
    reference_id VARCHAR(255) PRIMARY KEY,
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(255),
    name VARCHAR(255),
    password_hash VARCHAR(255),
    role VARCHAR(50) DEFAULT 'contractor',
    rating INT DEFAULT 100,
    supervisory_acc BOOLEAN DEFAULT FALSE,
    manager_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS jobsites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contractor_id VARCHAR(255),
    name VARCHAR(500),
    state VARCHAR(100),
    location VARCHAR(500),
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS active_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jobsite_id INT,
    worker_reference_id VARCHAR(255),
    worker_name VARCHAR(255),
    worker_phone VARCHAR(20),
    daily_wage DECIMAL(10,2),
    role VARCHAR(100),
    active BOOLEAN DEFAULT TRUE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS site_attendance_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jobsite_id INT,
    worker_reference_id VARCHAR(255),
    date DATE,
    status VARCHAR(20) DEFAULT 'PRESENT',
    payout_amount DECIMAL(10,2),
    UNIQUE (jobsite_id, worker_reference_id, date)
);
INSERT OR REPLACE INTO contractor_users VALUES 
('SG-C7K9M-3381', '9876543211', 'sunil@demo.in', 'Sunil Mehta', '{bcrypt_hash}', 'contractor', 92, 0, NULL, CURRENT_TIMESTAMP),
('SG-S4R7N-2291', '9876543212', 'rajesh@demo.in', 'Rajesh Sharma', '{bcrypt_hash}', 'supervisor', 88, 1, 'SG-C7K9M-3381', CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO jobsites VALUES 
(1, 'SG-C7K9M-3381', 'NH-48 Highway Expansion', 'Maharashtra', 'Pune, Hinjewadi Bypass Road', '2025-01-15', '2026-12-31', 'Active', CURRENT_TIMESTAMP),
(2, 'SG-C7K9M-3381', 'Residential Complex Block-B', 'Maharashtra', 'Mumbai, Andheri East, LBS Marg', '2025-06-01', '2027-03-31', 'Active', CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO active_links VALUES 
(1, 1, 'SG-A3F2B-4521', 'Ramesh Kumar', '9876543210', 600, 'Mason', 1, CURRENT_TIMESTAMP);
""")
con_c.commit()
con_c.close()

print(" Triple isolated databases created successfully for both PostgreSQL & SQLite!")
