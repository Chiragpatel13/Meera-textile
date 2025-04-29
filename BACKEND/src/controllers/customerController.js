const { pool } = require('../config/db');

// @desc    Get all active customers
// @route   GET /api/customers
// @access  Private
exports.getAllCustomers = async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            `SELECT 
                customer_id,
                name,
                contact_info,
                credit_limit,
                current_credit,
                created_at
            FROM customers 
            WHERE is_active = true 
            ORDER BY name ASC`
        );
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ message: 'Error fetching customers' });
    } finally {
        client.release();
    }
};

// @desc    Get customer by ID
// @route   GET /api/customers/:id
// @access  Private
exports.getCustomerById = async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();
    
    try {
        const result = await client.query(
            `SELECT 
                c.*,
                u1.username as created_by_name,
                u2.username as modified_by_name
            FROM customers c
            LEFT JOIN users u1 ON c.created_by = u1.user_id
            LEFT JOIN users u2 ON c.modified_by = u2.user_id
            WHERE customer_id = $1`,
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching customer:', error);
        res.status(500).json({ message: 'Error fetching customer details' });
    } finally {
        client.release();
    }
};

// @desc    Create new customer
// @route   POST /api/customers
// @access  Private
exports.createCustomer = async (req, res) => {
    const { name, contact_info, credit_limit } = req.body;
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        // Check if customer with same contact info exists
        const existingCustomer = await client.query(
            'SELECT customer_id FROM customers WHERE contact_info = $1',
            [contact_info]
        );
        
        if (existingCustomer.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ 
                message: 'Customer with this contact information already exists' 
            });
        }
        
        const result = await client.query(
            `INSERT INTO customers (
                name, 
                contact_info, 
                credit_limit, 
                created_by
            ) VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [name, contact_info, credit_limit, req.user.userId]
        );
        
        await client.query('COMMIT');
        res.status(201).json(result.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error creating customer:', error);
        res.status(500).json({ message: 'Error creating customer' });
    } finally {
        client.release();
    }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
exports.updateCustomer = async (req, res) => {
    const { id } = req.params;
    const { name, contact_info, credit_limit, is_active } = req.body;
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        // Check if customer exists
        const customerExists = await client.query(
            'SELECT customer_id FROM customers WHERE customer_id = $1',
            [id]
        );
        
        if (customerExists.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Customer not found' });
        }
        
        // Check if new contact info conflicts with another customer
        if (contact_info) {
            const conflictingCustomer = await client.query(
                'SELECT customer_id FROM customers WHERE contact_info = $1 AND customer_id != $2',
                [contact_info, id]
            );
            
            if (conflictingCustomer.rows.length > 0) {
                await client.query('ROLLBACK');
                return res.status(400).json({ 
                    message: 'Another customer with this contact information already exists' 
                });
            }
        }
        
        const result = await client.query(
            `UPDATE customers 
            SET 
                name = COALESCE($1, name),
                contact_info = COALESCE($2, contact_info),
                credit_limit = COALESCE($3, credit_limit),
                is_active = COALESCE($4, is_active),
                modified_at = CURRENT_TIMESTAMP,
                modified_by = $5
            WHERE customer_id = $6
            RETURNING *`,
            [name, contact_info, credit_limit, is_active, req.user.userId, id]
        );
        
        await client.query('COMMIT');
        res.json(result.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error updating customer:', error);
        res.status(500).json({ message: 'Error updating customer' });
    } finally {
        client.release();
    }
};

// @desc    Search customers
// @route   GET /api/customers/search
// @access  Private
exports.searchCustomers = async (req, res) => {
    const { query } = req.query;
    const client = await pool.connect();
    
    try {
        const result = await client.query(
            `SELECT 
                customer_id,
                name,
                contact_info,
                credit_limit,
                current_credit
            FROM customers 
            WHERE 
                is_active = true 
                AND (
                    name ILIKE $1 
                    OR contact_info ILIKE $1
                )
            ORDER BY name ASC
            LIMIT 10`,
            [`%${query}%`]
        );
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error searching customers:', error);
        res.status(500).json({ message: 'Error searching customers' });
    } finally {
        client.release();
    }
};
