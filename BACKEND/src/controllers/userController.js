const User = require('../models/user');
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const query = `
      SELECT user_id, username, full_name, email, role, created_at, last_login
      FROM users
      ORDER BY created_at DESC
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new user
// @route   POST /api/admin/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
  try {
    const { username, full_name, email, password, role } = req.body;

    // Validate required fields
    if (!username || !full_name || !email || !password || !role) {
      return res.status(400).json({ 
        message: 'All fields are required',
        details: {
          username: !username ? 'Username is required' : null,
          full_name: !full_name ? 'Full name is required' : null,
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null,
          role: !role ? 'Role is required' : null
        }
      });
    }

    // Check if user already exists
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create new user
    const user = await User.create({
      username,
      full_name,
      email,
      password,
      role
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, fullName, email, password, role } = req.body;

    // Check if user exists
    const userQuery = 'SELECT * FROM users WHERE user_id = $1';
    const userResult = await db.query(userQuery, [id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Build update query
    let updateQuery = 'UPDATE users SET ';
    const values = [];
    let paramCount = 1;

    if (username) {
      updateQuery += `username = $${paramCount}, `;
      values.push(username);
      paramCount++;
    }

    if (fullName) {
      updateQuery += `full_name = $${paramCount}, `;
      values.push(fullName);
      paramCount++;
    }

    if (email) {
      updateQuery += `email = $${paramCount}, `;
      values.push(email);
      paramCount++;
    }

    if (role) {
      updateQuery += `role = $${paramCount}, `;
      values.push(role);
      paramCount++;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);
      updateQuery += `password_hash = $${paramCount}, `;
      values.push(password_hash);
      paramCount++;
    }

    // Remove trailing comma and space
    updateQuery = updateQuery.slice(0, -2);

    // Add WHERE clause
    updateQuery += ` WHERE user_id = $${paramCount} RETURNING user_id, username, full_name, email, role`;
    values.push(id);

    const result = await db.query(updateQuery, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;

    // Check if user exists
    const userQuery = 'SELECT * FROM users WHERE user_id = $1';
    const userResult = await client.query(userQuery, [id]);
    if (userResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has created any SKUs
    const skusQuery = 'SELECT COUNT(*) FROM skus WHERE created_by = $1';
    const skusResult = await client.query(skusQuery, [id]);
    const skuCount = parseInt(skusResult.rows[0].count);

    if (skuCount > 0) {
      // Instead of deleting SKUs, reassign them to an admin user
      const adminQuery = 'SELECT user_id FROM users WHERE role = $1 AND user_id != $2 LIMIT 1';
      const adminResult = await client.query(adminQuery, ['STORE_MANAGER', id]);
      
      if (adminResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(409).json({
          message: 'Cannot delete user as they have created products and no other admin is available to transfer them to',
          code: '23503'
        });
      }

      const adminId = adminResult.rows[0].user_id;
      
      // Reassign SKUs to admin
      const updateSkusQuery = 'UPDATE skus SET created_by = $1 WHERE created_by = $2';
      await client.query(updateSkusQuery, [adminId, id]);
    }

    // Delete user
    const deleteQuery = 'DELETE FROM users WHERE user_id = $1';
    await client.query(deleteQuery, [id]);

    await client.query('COMMIT');
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Delete user error:', error);
    if (error.code === '23503') {
      return res.status(409).json({
        message: 'Cannot delete user as they have created products in the system',
        code: error.code,
        detail: error.detail
      });
    }
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
}; 