-- Clothing Management and Distribution System Database Schema
-- PostgreSQL Implementation
-- Version 1.0
-- Designed based on SRS V1.2 requirements

-- Enum Types for Standardization
CREATE TYPE payment_method AS ENUM ('CASH', 'QR_CODE');
CREATE TYPE payment_status AS ENUM ('PENDING', 'COMPLETED', 'REFUNDED', 'FAILED');
CREATE TYPE credit_status AS ENUM ('ACTIVE', 'OVERDUE', 'PAID', 'CANCELLED');
CREATE TYPE return_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PROCESSED');

-- User Roles Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('SALES_STAFF', 'INVENTORY_STAFF', 'STORE_MANAGER')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- SKU (Stock Keeping Unit) Table
CREATE TABLE skus (
    sku_id SERIAL PRIMARY KEY,
    sku_code VARCHAR(50) NOT NULL UNIQUE,
    fabric_type VARCHAR(50) NOT NULL,
    color VARCHAR(30) NOT NULL,
    pattern VARCHAR(50),
    price_per_meter NUMERIC(10,2) NOT NULL CHECK (price_per_meter > 0),
    created_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inventory Table
CREATE TABLE inventory (
    inventory_id SERIAL PRIMARY KEY,
    sku_id INTEGER REFERENCES skus(sku_id),
    total_quantity NUMERIC(10,2) NOT NULL CHECK (total_quantity >= 0),
    reorder_point NUMERIC(10,2) NOT NULL CHECK (reorder_point >= 0),
    last_restocked_at TIMESTAMP WITH TIME ZONE,
    last_updated_by INTEGER REFERENCES users(user_id),
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Customer Profile Table
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) UNIQUE,
    email VARCHAR(100) UNIQUE,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    total_purchases NUMERIC(12,2) DEFAULT 0,
    last_purchase_date TIMESTAMP WITH TIME ZONE
);

-- Credit Period Table
CREATE TABLE credit_transactions (
    credit_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(customer_id),
    start_date DATE NOT NULL,
    due_date DATE NOT NULL,
    total_amount NUMERIC(10,2) NOT NULL,
    paid_amount NUMERIC(10,2) DEFAULT 0,
    status credit_status NOT NULL DEFAULT 'ACTIVE',
    created_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(customer_id),
    total_amount NUMERIC(10,2) NOT NULL,
    discount_percentage NUMERIC(5,2) DEFAULT 0,
    tax_amount NUMERIC(10,2) DEFAULT 0,
    net_amount NUMERIC(10,2) NOT NULL,
    order_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_by INTEGER REFERENCES users(user_id)
);

-- Order Items Table
CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(order_id),
    sku_id INTEGER REFERENCES skus(sku_id),
    quantity NUMERIC(10,2) NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10,2) NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL
);

-- Payments Table
CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(order_id),
    amount NUMERIC(10,2) NOT NULL,
    payment_method payment_method NOT NULL,
    payment_status payment_status NOT NULL DEFAULT 'PENDING',
    qr_code_reference VARCHAR(100),
    transaction_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_by INTEGER REFERENCES users(user_id)
);

-- Returns Table
CREATE TABLE returns (
    return_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(order_id),
    return_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    total_return_amount NUMERIC(10,2) NOT NULL,
    status return_status NOT NULL DEFAULT 'PENDING',
    reason TEXT,
    processed_by INTEGER REFERENCES users(user_id)
);

-- Return Items Table
CREATE TABLE return_items (
    return_item_id SERIAL PRIMARY KEY,
    return_id INTEGER REFERENCES returns(return_id),
    order_item_id INTEGER REFERENCES order_items(order_item_id),
    quantity NUMERIC(10,2) NOT NULL,
    reason TEXT
);

-- Indexes for Performance Optimization
-- User-related Indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- SKU and Inventory Indexes
CREATE INDEX idx_skus_fabric_type ON skus(fabric_type);
CREATE INDEX idx_skus_color ON skus(color);
CREATE INDEX idx_inventory_sku ON inventory(sku_id);
CREATE INDEX idx_inventory_low_stock ON inventory(total_quantity) 
    WHERE total_quantity <= reorder_point;

-- Customer Indexes
CREATE INDEX idx_customers_total_purchases ON customers(total_purchases);
CREATE INDEX idx_customers_last_purchase ON customers(last_purchase_date);

-- Order and Payment Indexes
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(payment_status);

-- Credit Transaction Indexes
CREATE INDEX idx_credit_customer ON credit_transactions(customer_id);
CREATE INDEX idx_credit_status ON credit_transactions(status);

-- Comments for Database Objects
COMMENT ON TABLE skus IS 'Stores information about individual stock keeping units (SKUs)';
COMMENT ON TABLE inventory IS 'Tracks current stock levels and reorder points for each SKU';
COMMENT ON TABLE customers IS 'Stores customer profile and purchase history information';
COMMENT ON TABLE orders IS 'Captures customer order details';
COMMENT ON TABLE payments IS 'Records payment information for each order';
COMMENT ON TABLE returns IS 'Manages product return transactions';

-- Sample Data Insertion Queries
-- Note: These are example queries and should be adapted to actual business data

-- Insert a sample user
INSERT INTO users (username, full_name, email, password_hash, role) VALUES 
('john_doe', 'John Doe', 'john@miratextile.com', 'hashed_password_here', 'STORE_MANAGER');

-- Insert a sample SKU
INSERT INTO skus (sku_code, fabric_type, color, pattern, price_per_meter, created_by) VALUES 
('COT-RED-001', 'Cotton', 'Red', 'Solid', 15.50, 1);

-- Insert inventory for the SKU
INSERT INTO inventory (sku_id, total_quantity, reorder_point) VALUES 
((SELECT sku_id FROM skus WHERE sku_code = 'COT-RED-001'), 100.5, 20);

-- Sample Complex Queries

-- 1. Retrieve Low Stock Items
SELECT 
    s.sku_code, 
    s.fabric_type, 
    s.color, 
    i.total_quantity, 
    i.reorder_point
FROM 
    inventory i
JOIN 
    skus s ON i.sku_id = s.sku_id
WHERE 
    i.total_quantity <= i.reorder_point;

-- 2. Calculate Total Sales for a Specific Period
SELECT 
    DATE_TRUNC('month', order_date) AS sales_month,
    COUNT(*) AS total_orders,
    SUM(net_amount) AS total_revenue
FROM 
    orders
GROUP BY 
    sales_month
ORDER BY 
    sales_month;

-- 3. Customer Order History with Details
SELECT 
    c.full_name,
    o.order_id,
    o.order_date,
    o.net_amount,
    array_agg(CONCAT(s.fabric_type, ' - ', s.color, ' (', oi.quantity, ' meters)')) AS order_details
FROM 
    customers c
JOIN 
    orders o ON c.customer_id = o.customer_id
JOIN 
    order_items oi ON o.order_id = oi.order_id
JOIN 
    skus s ON oi.sku_id = s.sku_id
GROUP BY 
    c.full_name, o.order_id, o.order_date, o.net_amount
ORDER BY 
    o.order_date DESC;
