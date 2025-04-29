-- Authentication and Authorization Schema

-- Drop existing role enum and recreate it
DROP TYPE IF EXISTS user_role CASCADE;
CREATE TYPE user_role AS ENUM (
    'ADMIN',
    'STORE_MANAGER',
    'SALES_STAFF',
    'INVENTORY_STAFF'
);

-- Add new columns to users table
ALTER TABLE users
DROP COLUMN IF EXISTS role CASCADE;

ALTER TABLE users
ADD COLUMN role user_role NOT NULL DEFAULT 'SALES_STAFF',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS created_by INTEGER REFERENCES users(user_id),
ADD COLUMN IF NOT EXISTS modified_by INTEGER REFERENCES users(user_id),
ADD COLUMN IF NOT EXISTS last_modified TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Create login attempts table for tracking failed logins and implementing account lockout
DROP TABLE IF EXISTS login_attempts CASCADE;
CREATE TABLE login_attempts (
    attempt_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    attempt_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    success BOOLEAN DEFAULT FALSE,
    user_agent TEXT
);

-- Create audit log table for tracking security-related events
DROP TABLE IF EXISTS security_audit_log CASCADE;
CREATE TABLE security_audit_log (
    log_id SERIAL PRIMARY KEY,
    event_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    event_type VARCHAR(50) NOT NULL,
    user_id INTEGER REFERENCES users(user_id),
    ip_address VARCHAR(45),
    user_agent TEXT,
    details JSONB
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_login_attempts_user_time 
ON login_attempts(user_id, attempt_time);

CREATE INDEX IF NOT EXISTS idx_login_attempts_success 
ON login_attempts(success);

CREATE INDEX IF NOT EXISTS idx_security_audit_user 
ON security_audit_log(user_id);

CREATE INDEX IF NOT EXISTS idx_security_audit_event_type 
ON security_audit_log(event_type);
