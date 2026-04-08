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
