-- Customer Management Schema

-- Drop existing tables and indexes if they exist
DROP TABLE IF EXISTS customers CASCADE;
DROP INDEX IF EXISTS idx_customer_name;
DROP INDEX IF EXISTS idx_customer_contact;

-- Create customers table
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_info VARCHAR(100) NOT NULL UNIQUE,
    credit_limit DECIMAL(10, 2) DEFAULT 500.00,
    current_credit DECIMAL(10, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(user_id),
    modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modified_by INTEGER REFERENCES users(user_id)
);

-- Create index on customer name for faster search
CREATE INDEX idx_customer_name ON customers(name);

-- Create index on contact info for faster lookup
CREATE INDEX idx_customer_contact ON customers(contact_info);
