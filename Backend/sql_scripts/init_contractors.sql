-- ============================================
-- Suraksha Grid: Contractors DB Initialization
-- ============================================

CREATE TABLE IF NOT EXISTS jobsites (
    id INT AUTO_INCREMENT PRIMARY KEY,
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
    id INT AUTO_INCREMENT PRIMARY KEY,
    jobsite_id INT,
    worker_reference_id VARCHAR(255),
    daily_wage DECIMAL(10,2),
    role VARCHAR(100),
    active BOOLEAN DEFAULT TRUE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (jobsite_id) REFERENCES jobsites(id)
);

CREATE TABLE IF NOT EXISTS attendance_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    jobsite_id INT,
    worker_reference_id VARCHAR(255),
    date DATE,
    status VARCHAR(20) DEFAULT 'PRESENT',
    payout_amount DECIMAL(10,2),
    UNIQUE KEY unique_attendance (jobsite_id, worker_reference_id, date),
    FOREIGN KEY (jobsite_id) REFERENCES jobsites(id)
);

-- ============================================
-- DEMO JOBSITES (under contractor SG-C7K9M-3381)
-- ============================================
INSERT INTO jobsites (contractor_id, name, state, location, start_date, end_date, status)
VALUES ('SG-C7K9M-3381', 'NH-48 Highway Expansion', 'Maharashtra', 'Pune, Hinjewadi Bypass Road',
        '2025-01-15', '2026-12-31', 'Active');

INSERT INTO jobsites (contractor_id, name, state, location, start_date, end_date, status)
VALUES ('SG-C7K9M-3381', 'Residential Complex Block-B', 'Maharashtra', 'Mumbai, Andheri East, LBS Marg',
        '2025-06-01', '2027-03-31', 'Active');

-- ============================================
-- LINK DEMO WORKER TO JOBSITE 1
-- ============================================
INSERT INTO active_links (jobsite_id, worker_reference_id, daily_wage, role, active)
VALUES (1, 'SG-A3F2B-4521', 600.00, 'Mason', TRUE);

-- ============================================
-- ATTENDANCE LOGS: ~120 days for demo worker
-- (This gives ~1.3 BOCW years at 90 days/year)
-- Using date sequences starting from 2025-01-20
-- ============================================

-- January 2025: 10 working days
INSERT INTO attendance_logs (jobsite_id, worker_reference_id, date, status, payout_amount) VALUES
(1, 'SG-A3F2B-4521', '2025-01-20', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-01-21', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-01-22', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-01-23', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-01-24', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-01-27', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-01-28', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-01-29', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-01-30', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-01-31', 'PRESENT', 600.00);

-- February 2025: 20 working days
INSERT INTO attendance_logs (jobsite_id, worker_reference_id, date, status, payout_amount) VALUES
(1, 'SG-A3F2B-4521', '2025-02-03', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-02-04', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-02-05', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-02-06', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-02-07', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-02-10', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-02-11', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-02-12', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-02-13', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-02-14', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-02-17', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-02-18', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-02-19', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-02-20', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-02-21', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-02-24', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-02-25', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-02-26', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-02-27', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-02-28', 'PRESENT', 600.00);

-- March 2025: 20 working days
INSERT INTO attendance_logs (jobsite_id, worker_reference_id, date, status, payout_amount) VALUES
(1, 'SG-A3F2B-4521', '2025-03-03', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-03-04', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-03-05', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-03-06', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-03-07', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-03-10', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-03-11', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-03-12', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-03-13', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-03-14', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-03-17', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-03-18', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-03-19', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-03-20', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-03-21', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-03-24', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-03-25', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-03-26', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-03-27', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-03-28', 'PRESENT', 600.00);

-- April 2025: 20 working days
INSERT INTO attendance_logs (jobsite_id, worker_reference_id, date, status, payout_amount) VALUES
(1, 'SG-A3F2B-4521', '2025-04-01', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-04-02', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-04-03', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-04-04', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-04-07', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-04-08', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-04-09', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-04-10', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-04-11', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-04-14', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-04-15', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-04-16', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-04-17', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-04-18', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-04-21', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-04-22', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-04-23', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-04-24', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-04-25', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-04-28', 'PRESENT', 600.00);

-- May 2025: 20 working days
INSERT INTO attendance_logs (jobsite_id, worker_reference_id, date, status, payout_amount) VALUES
(1, 'SG-A3F2B-4521', '2025-05-01', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-05-02', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-05-05', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-05-06', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-05-07', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-05-08', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-05-09', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-05-12', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-05-13', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-05-14', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-05-15', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-05-16', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-05-19', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-05-20', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-05-21', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-05-22', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-05-23', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-05-26', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-05-27', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-05-28', 'PRESENT', 600.00);

-- June 2025: 10 working days (partial month)
INSERT INTO attendance_logs (jobsite_id, worker_reference_id, date, status, payout_amount) VALUES
(1, 'SG-A3F2B-4521', '2025-06-02', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-06-03', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-06-04', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-06-05', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-06-06', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-06-09', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-06-10', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-06-11', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-06-12', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-06-13', 'PRESENT', 600.00);

-- July 2025: 20 working days
INSERT INTO attendance_logs (jobsite_id, worker_reference_id, date, status, payout_amount) VALUES
(1, 'SG-A3F2B-4521', '2025-07-01', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-07-02', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-07-03', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-07-04', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-07-07', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-07-08', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-07-09', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-07-10', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-07-11', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-07-14', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-07-15', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-07-16', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-07-17', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-07-18', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-07-21', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-07-22', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-07-23', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-07-24', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-07-25', 'PRESENT', 600.00),
(1, 'SG-A3F2B-4521', '2025-07-28', 'PRESENT', 600.00);

-- Total: 10 + 20 + 20 + 20 + 20 + 10 + 20 = 120 days
-- 120 / 90 = 1.33 BOCW years -> eligible for 1-year benefits
