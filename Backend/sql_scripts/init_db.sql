-- ============================================
-- Suraksha Grid: Common DB Initialization
-- ============================================

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
    id INT AUTO_INCREMENT PRIMARY KEY,
    state VARCHAR(200),
    benifitname VARCHAR(500),
    benifittype VARCHAR(100),
    minimumyear INT DEFAULT 0,
    workdays INT DEFAULT 0,
    conditions TEXT
);

-- ============================================
-- DEMO USERS
-- ============================================

-- Demo Worker (password: demo1234)
INSERT INTO users (reference_id, phone, email, name, dob, gender, state, password_hash, role, rating)
VALUES ('SG-A3F2B-4521', '9876543210', 'ramesh@demo.in', 'Ramesh Kumar', '1990-05-15', 'M', 'Maharashtra',
        '$2b$12$LJ3m4ys2Gt9mHgSqwB8pHuKjXp8WzFMbXmJnPfVhKqFqMHWBXGKZW', 'worker', 95);

-- Demo Contractor (password: demo1234)
INSERT INTO users (reference_id, phone, email, name, dob, gender, state, password_hash, role, rating)
VALUES ('SG-C7K9M-3381', '9876543211', 'sunil@demo.in', 'Sunil Mehta', '1985-03-22', 'M', 'Maharashtra',
        '$2b$12$LJ3m4ys2Gt9mHgSqwB8pHuKjXp8WzFMbXmJnPfVhKqFqMHWBXGKZW', 'contractor', 92);

-- Demo Supervisor / Jobsite Manager (password: demo1234)
INSERT INTO users (reference_id, phone, email, name, dob, gender, state, password_hash, role, rating, supervisory_acc, manager_id)
VALUES ('SG-S4R7N-2291', '9876543212', 'rajesh@demo.in', 'Rajesh Sharma', '1988-11-10', 'M', 'Maharashtra',
        '$2b$12$LJ3m4ys2Gt9mHgSqwB8pHuKjXp8WzFMbXmJnPfVhKqFqMHWBXGKZW', 'supervisor', 88, TRUE, 'SG-C7K9M-3381');

-- ============================================
-- BENEFITS: Maharashtra
-- ============================================
INSERT INTO benefits (state, benifitname, benifittype, minimumyear, workdays, conditions)
VALUES ('Maharashtra', 'BOCW Accident Insurance - ₹5,00,000 coverage', 'Insurance', 1, 90,
        'Worker must be registered with BOCW board for minimum 1 year. Covers accidental death and permanent disability.');

INSERT INTO benefits (state, benifitname, benifittype, minimumyear, workdays, conditions)
VALUES ('Maharashtra', 'Housing Loan Subsidy - ₹1,00,000', 'Housing', 3, 270,
        'Must have completed 3 years of registered construction work. One-time subsidy for house construction or repair.');

INSERT INTO benefits (state, benifitname, benifittype, minimumyear, workdays, conditions)
VALUES ('Maharashtra', 'Pension Scheme - ₹3,000/month', 'Pension', 5, 450,
        'Worker must be 60+ years old with minimum 5 years of BOCW registration. Monthly pension after retirement.');

INSERT INTO benefits (state, benifitname, benifittype, minimumyear, workdays, conditions)
VALUES ('Maharashtra', 'Tool Kit Assistance - ₹5,000', 'Financial Aid', 0, 0,
        'One-time assistance for purchase of tools. Available to all registered workers regardless of seniority.');

INSERT INTO benefits (state, benifitname, benifittype, minimumyear, workdays, conditions)
VALUES ('Maharashtra', 'Maternity Benefit - 90 days paid leave', 'Financial Aid', 1, 90,
        'Female workers registered for minimum 1 year. Paid maternity leave for up to 2 pregnancies.');

-- ============================================
-- BENEFITS: Uttar Pradesh
-- ============================================
INSERT INTO benefits (state, benifitname, benifittype, minimumyear, workdays, conditions)
VALUES ('Uttar Pradesh', 'BOCW Medical Aid - ₹1,00,000', 'Healthcare', 0, 0,
        'Medical reimbursement for serious illness or hospitalization. Available to all registered workers.');

INSERT INTO benefits (state, benifitname, benifittype, minimumyear, workdays, conditions)
VALUES ('Uttar Pradesh', 'Education Scholarship - up to ₹60,000/year', 'Education', 1, 90,
        'For children of registered workers. Covers school and college fees. Minimum 1 year registration required.');

INSERT INTO benefits (state, benifitname, benifittype, minimumyear, workdays, conditions)
VALUES ('Uttar Pradesh', 'Marriage Assistance - ₹55,000', 'Financial Aid', 3, 270,
        'One-time financial assistance for marriage of self or children. Minimum 3 years of BOCW registration.');

INSERT INTO benefits (state, benifitname, benifittype, minimumyear, workdays, conditions)
VALUES ('Uttar Pradesh', 'Funeral Assistance - ₹25,000', 'Financial Aid', 0, 0,
        'Financial aid to family of deceased worker for funeral expenses. No minimum seniority required.');

INSERT INTO benefits (state, benifitname, benifittype, minimumyear, workdays, conditions)
VALUES ('Uttar Pradesh', 'Disability Pension - ₹2,000/month', 'Pension', 5, 450,
        'For workers with permanent disability after 5 years of registration. Monthly pension until recovery or death.');

-- ============================================
-- BENEFITS: Delhi
-- ============================================
INSERT INTO benefits (state, benifitname, benifittype, minimumyear, workdays, conditions)
VALUES ('Delhi', 'BOCW Accident Insurance - ₹2,00,000 coverage', 'Insurance', 0, 0,
        'Accident insurance for all registered construction workers. No minimum seniority required.');

INSERT INTO benefits (state, benifitname, benifittype, minimumyear, workdays, conditions)
VALUES ('Delhi', 'Free Medical OPD Treatment', 'Healthcare', 0, 0,
        'Free outpatient medical treatment at designated government hospitals for registered BOCW workers.');

INSERT INTO benefits (state, benifitname, benifittype, minimumyear, workdays, conditions)
VALUES ('Delhi', 'Scholarship for 2 Children - ₹12,000/year each', 'Education', 1, 90,
        'Annual scholarship for up to 2 children of registered workers. Minimum 1 year registration required.');

INSERT INTO benefits (state, benifitname, benifittype, minimumyear, workdays, conditions)
VALUES ('Delhi', 'Funeral Assistance - ₹5,000', 'Financial Aid', 0, 0,
        'Financial assistance for last rites of deceased worker. Available to all registered workers.');

INSERT INTO benefits (state, benifitname, benifittype, minimumyear, workdays, conditions)
VALUES ('Delhi', 'Maternity Benefit - ₹15,000', 'Financial Aid', 1, 90,
        'One-time maternity benefit for female registered workers. Minimum 1 year of BOCW registration.');

-- ============================================
-- BENEFITS: Karnataka
-- ============================================
INSERT INTO benefits (state, benifitname, benifittype, minimumyear, workdays, conditions)
VALUES ('Karnataka', 'BOCW Accident Insurance - ₹2,00,000 coverage', 'Insurance', 0, 0,
        'Accident and death insurance for all registered construction workers in Karnataka.');

INSERT INTO benefits (state, benifitname, benifittype, minimumyear, workdays, conditions)
VALUES ('Karnataka', 'Housing Assistance - ₹2,00,000', 'Housing', 5, 450,
        'Financial assistance for construction of own house. Minimum 5 years of BOCW registration required.');

INSERT INTO benefits (state, benifitname, benifittype, minimumyear, workdays, conditions)
VALUES ('Karnataka', 'Education Aid - ₹10,000/year per child', 'Education', 1, 90,
        'Annual education aid for children of registered workers. Covers school supplies and fees.');

INSERT INTO benefits (state, benifitname, benifittype, minimumyear, workdays, conditions)
VALUES ('Karnataka', 'Marriage Grant - ₹50,000', 'Financial Aid', 3, 270,
        'One-time marriage grant for registered worker or their children. Minimum 3 years registration.');

INSERT INTO benefits (state, benifitname, benifittype, minimumyear, workdays, conditions)
VALUES ('Karnataka', 'Tool Kit Assistance - ₹3,000', 'Financial Aid', 0, 0,
        'One-time tool kit purchase assistance. Available to all registered BOCW workers in Karnataka.');

-- ============================================
-- BENEFITS: Tamil Nadu
-- ============================================
INSERT INTO benefits (state, benifitname, benifittype, minimumyear, workdays, conditions)
VALUES ('Tamil Nadu', 'BOCW Accident Insurance - ₹3,00,000 coverage', 'Insurance', 0, 0,
        'Comprehensive accident insurance covering death and permanent disability for registered workers.');

INSERT INTO benefits (state, benifitname, benifittype, minimumyear, workdays, conditions)
VALUES ('Tamil Nadu', 'Marriage Assistance - ₹25,000', 'Financial Aid', 2, 180,
        'Financial assistance for marriage of self or children. Minimum 2 years of BOCW registration required.');

INSERT INTO benefits (state, benifitname, benifittype, minimumyear, workdays, conditions)
VALUES ('Tamil Nadu', 'Education Scholarship - ₹15,000/year', 'Education', 1, 90,
        'Annual scholarship for higher education of workers children. Minimum 1 year registration.');

INSERT INTO benefits (state, benifitname, benifittype, minimumyear, workdays, conditions)
VALUES ('Tamil Nadu', 'Funeral Assistance - ₹15,000', 'Financial Aid', 0, 0,
        'Financial aid for funeral expenses of deceased registered worker. No minimum seniority.');

INSERT INTO benefits (state, benifitname, benifittype, minimumyear, workdays, conditions)
VALUES ('Tamil Nadu', 'Pension Scheme - ₹1,000/month', 'Pension', 5, 450,
        'Monthly pension for retired workers aged 60+. Minimum 5 years of BOCW registration required.');
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
-- ============================================
-- Suraksha Grid: Home Labor DB Initialization
-- ============================================

CREATE TABLE IF NOT EXISTS union_memberships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    worker_reference_id VARCHAR(255),
    union_name VARCHAR(500),
    state VARCHAR(100),
    from_date VARCHAR(20),
    to_date VARCHAR(20),
    benefit_summary VARCHAR(500),
    status VARCHAR(50) DEFAULT 'Active'
);

CREATE TABLE IF NOT EXISTS labour_board_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
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

-- ============================================
-- DEMO UNION MEMBERSHIPS (worker SG-A3F2B-4521)
-- ============================================

INSERT INTO union_memberships (worker_reference_id, union_name, state, from_date, to_date, benefit_summary, status)
VALUES ('SG-A3F2B-4521', 'All India Trade Union Congress (AITUC)', 'Delhi',
        '2019-03-15', '2021-02-28',
        'Legal aid, accident coverage ₹50,000, monthly meeting allowance',
        'Inactive');

INSERT INTO union_memberships (worker_reference_id, union_name, state, from_date, to_date, benefit_summary, status)
VALUES ('SG-A3F2B-4521', 'Indian National Trade Union Congress (INTUC)', 'Maharashtra',
        '2021-04-01', '2023-03-31',
        'Health check-up camps, tool kit subsidy ₹3,000, legal representation',
        'Inactive');

INSERT INTO union_memberships (worker_reference_id, union_name, state, from_date, to_date, benefit_summary, status)
VALUES ('SG-A3F2B-4521', 'Hind Mazdoor Sabha (HMS)', 'Maharashtra',
        '2023-06-01', 'Present',
        'Accident insurance ₹1L, skill training programs, wage negotiation support',
        'Active');

-- ============================================
-- DEMO LABOUR BOARD REGISTRATIONS (worker SG-A3F2B-4521)
-- ============================================

INSERT INTO labour_board_registrations (worker_reference_id, board_name, short_name, state, reg_number, from_date, to_date, status, contributions, contact, website, cert_status)
VALUES ('SG-A3F2B-4521',
        'Delhi Building and Other Construction Workers Welfare Board', 'Delhi BOCW Board',
        'Delhi', 'DL-BOCW-2019-48723',
        '2019-01-10', '2021-01-09',
        'Inactive',
        '₹25/month contributed for 24 months (Total: ₹600)',
        '011-23456789',
        'https://labour.delhi.gov.in',
        'Expired');

INSERT INTO labour_board_registrations (worker_reference_id, board_name, short_name, state, reg_number, from_date, to_date, status, contributions, contact, website, cert_status)
VALUES ('SG-A3F2B-4521',
        'Maharashtra Building and Other Construction Workers Welfare Board', 'Maharashtra BOCW Board',
        'Maharashtra', 'MH-BOCW-2021-91205',
        '2021-05-15', 'Present',
        'Active',
        '₹50/month contributed for 49 months (Total: ₹2,450)',
        '022-26571234',
        'https://mahabocw.in',
        'Valid till Dec 2025');

INSERT INTO labour_board_registrations (worker_reference_id, board_name, short_name, state, reg_number, from_date, to_date, status, contributions, contact, website, cert_status)
VALUES ('SG-A3F2B-4521',
        'Inter-State Migrant Workmen Central Board', 'ISMW Central Board',
        'Central', 'ISMW-CEN-2020-33481',
        '2020-08-01', 'Present',
        'Active',
        '₹30/month contributed for 58 months (Total: ₹1,740)',
        '011-23384567',
        'https://labour.gov.in/ismw',
        'Valid');
