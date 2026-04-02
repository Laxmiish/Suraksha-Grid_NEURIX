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