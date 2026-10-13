-- Suraksha Grid PostgreSQL Schema

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
    supervisory_acc BOOLEAN DEFAULT FALSE,
    manager_id VARCHAR(255),
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
    jobsite_id INT REFERENCES jobsites(id),
    worker_reference_id VARCHAR(255),
    daily_wage DECIMAL(10,2),
    role VARCHAR(100),
    active BOOLEAN DEFAULT TRUE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendance_logs (
    id SERIAL PRIMARY KEY,
    jobsite_id INT REFERENCES jobsites(id),
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

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_attendance_worker ON attendance_logs(worker_reference_id, status);
CREATE INDEX IF NOT EXISTS idx_benefits_state_minyear ON benefits(state, minimumyear);
CREATE INDEX IF NOT EXISTS idx_union_worker ON union_memberships(worker_reference_id);
CREATE INDEX IF NOT EXISTS idx_board_worker ON labour_board_registrations(worker_reference_id);
