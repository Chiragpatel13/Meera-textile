const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');

// Maximum login attempts before account lockout
const MAX_LOGIN_ATTEMPTS = 5;
// Lockout duration in minutes
const LOCKOUT_DURATION = 30;

const authController = {
  // @desc    Login user
  // @route   POST /api/auth/login
  // @access  Public
  async login(req, res) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN'); // Start transaction
      
      const { username, password } = req.body;
      
      // Check if user exists and get login attempts
      const userQuery = `
        SELECT u.*, 
               (SELECT COUNT(*) FROM login_attempts 
                WHERE user_id = u.user_id 
                AND attempt_time > NOW() - INTERVAL '${LOCKOUT_DURATION} minutes') as recent_attempts
        FROM users u 
        WHERE username = $1
      `;
      const userResult = await client.query(userQuery, [username]);
      const user = userResult.rows[0];
      
      if (!user) {
        await client.query('COMMIT');
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check if account is locked
      if (user.recent_attempts >= MAX_LOGIN_ATTEMPTS) {
        await client.query('COMMIT');
        return res.status(401).json({ 
          message: `Account temporarily locked. Please try again after ${LOCKOUT_DURATION} minutes.`
        });
      }

      // Check if user is active
      if (!user.is_active) {
        await client.query('COMMIT');
        return res.status(401).json({ message: 'Account is deactivated' });
      }
      
      // Check password
      const isMatch = await bcrypt.compare(password, user.password_hash);
      
      if (!isMatch) {
        // Record failed attempt
        await client.query(
          'INSERT INTO login_attempts (user_id, attempt_time, success) VALUES ($1, NOW(), false)',
          [user.user_id]
        );
        
        await client.query('COMMIT');
        
        return res.status(401).json({ 
          message: 'Invalid credentials',
          attemptsLeft: MAX_LOGIN_ATTEMPTS - (user.recent_attempts + 1)
        });
      }
      
      // Clear login attempts on successful login
      await client.query(
        'DELETE FROM login_attempts WHERE user_id = $1',
        [user.user_id]
      );
      
      // Record successful login
      await client.query(
        'INSERT INTO login_attempts (user_id, attempt_time, success) VALUES ($1, NOW(), true)',
        [user.user_id]
      );
      
      // Update last login
      await client.query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1',
        [user.user_id]
      );
      
      // Create and sign JWT token
      const token = jwt.sign(
        { 
          userId: user.user_id,
          username: user.username,
          role: user.role
        },
        JWT_SECRET,
        { 
          expiresIn: user.role === 'ADMIN' ? '4h' : '8h' // Shorter session for admin
        }
      );
      
      await client.query('COMMIT');
      
      res.json({
        token,
        user: {
          id: user.user_id,
          username: user.username,
          full_name: user.full_name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    } finally {
      client.release();
    }
  },

  // @desc    Get user profile
  // @route   GET /api/auth/profile
  // @access  Private
  async getProfile(req, res) {
    try {
      const userId = req.user.userId;
      
      const query = `
        SELECT 
          u.user_id,
          u.username,
          u.full_name,
          u.email,
          u.role,
          u.created_at,
          u.last_login,
          u.is_active,
          COUNT(DISTINCT o.order_id) as total_orders,
          COUNT(DISTINCT CASE WHEN o.order_date > NOW() - INTERVAL '30 days' THEN o.order_id END) as recent_orders
        FROM users u
        LEFT JOIN orders o ON u.user_id = o.processed_by
        WHERE u.user_id = $1
        GROUP BY u.user_id
      `;
      
      const result = await pool.query(query, [userId]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const user = result.rows[0];
      
      res.json({
        id: user.user_id,
        username: user.username,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
        created_at: user.created_at,
        last_login: user.last_login,
        activity: {
          total_orders: parseInt(user.total_orders),
          recent_orders: parseInt(user.recent_orders)
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // @desc    Create new user (Admin only)
  // @route   POST /api/auth/users
  // @access  Private/Admin
  async createUser(req, res) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const { username, fullName, email, password, role } = req.body;
      
      // Check if username or email already exists
      const checkQuery = 'SELECT username, email FROM users WHERE username = $1 OR email = $2';
      const checkResult = await client.query(checkQuery, [username, email]);
      
      if (checkResult.rows.length > 0) {
        const existingUser = checkResult.rows[0];
        if (existingUser.username === username) {
          await client.query('ROLLBACK');
          return res.status(400).json({ message: 'Username already exists' });
        }
        if (existingUser.email === email) {
          await client.query('ROLLBACK');
          return res.status(400).json({ message: 'Email already exists' });
        }
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create user
      const insertQuery = `
        INSERT INTO users (
          username,
          full_name,
          email,
          password_hash,
          role,
          is_active,
          created_by
        ) VALUES ($1, $2, $3, $4, $5, true, $6)
        RETURNING user_id, username, full_name, email, role, created_at
      `;
      
      const result = await client.query(insertQuery, [
        username,
        fullName,
        email,
        hashedPassword,
        role,
        req.user.userId
      ]);
      
      await client.query('COMMIT');
      
      res.status(201).json({
        message: 'User created successfully',
        user: result.rows[0]
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Create user error:', error);
      res.status(500).json({ message: 'Server error' });
    } finally {
      client.release();
    }
  },

  // @desc    Update user status (Admin only)
  // @route   PATCH /api/auth/users/:id/status
  // @access  Private/Admin
  async updateUserStatus(req, res) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const { id } = req.params;
      const { is_active } = req.body;
      
      // Check if user exists and is not an admin
      const userQuery = 'SELECT role FROM users WHERE user_id = $1';
      const userResult = await client.query(userQuery, [id]);
      
      if (userResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ message: 'User not found' });
      }
      
      if (userResult.rows[0].role === 'ADMIN') {
        await client.query('ROLLBACK');
        return res.status(403).json({ message: 'Cannot modify admin account status' });
      }
      
      // Update user status
      const updateQuery = `
        UPDATE users 
        SET is_active = $1, 
            last_modified = CURRENT_TIMESTAMP,
            modified_by = $2
        WHERE user_id = $3
        RETURNING user_id, username, is_active
      `;
      
      const result = await client.query(updateQuery, [is_active, req.user.userId, id]);
      
      // If deactivating, invalidate all active sessions
      if (!is_active) {
        // In a real application, you would also invalidate the user's active JWT tokens
        // This could be done by maintaining a token blacklist or using a token version system
        await client.query('DELETE FROM login_attempts WHERE user_id = $1', [id]);
      }
      
      await client.query('COMMIT');
      
      res.json({
        message: `User ${is_active ? 'activated' : 'deactivated'} successfully`,
        user: result.rows[0]
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Update user status error:', error);
      res.status(500).json({ message: 'Server error' });
    } finally {
      client.release();
    }
  },

  // @desc    Get all users (Admin and Store Manager)
  // @route   GET /api/auth/users
  // @access  Private/Admin,StoreManager
  async getUsers(req, res) {
    const client = await pool.connect();
    
    try {
      const query = `
        SELECT 
          u.user_id,
          u.username,
          u.full_name,
          u.email,
          u.role,
          u.is_active,
          u.created_at,
          u.last_login,
          creator.username as created_by_username,
          modifier.username as modified_by_username,
          COUNT(DISTINCT o.order_id) as total_orders,
          COUNT(DISTINCT CASE WHEN o.order_date > NOW() - INTERVAL '30 days' THEN o.order_id END) as recent_orders,
          (
            SELECT COUNT(*) 
            FROM login_attempts la 
            WHERE la.user_id = u.user_id 
            AND la.success = false 
            AND la.attempt_time > NOW() - INTERVAL '30 minutes'
          ) as recent_failed_attempts
        FROM users u
        LEFT JOIN users creator ON u.created_by = creator.user_id
        LEFT JOIN users modifier ON u.modified_by = modifier.user_id
        LEFT JOIN orders o ON u.user_id = o.processed_by
        WHERE u.role != 'ADMIN' -- Never expose admin users
        GROUP BY 
          u.user_id, 
          creator.username,
          modifier.username
        ORDER BY u.created_at DESC
      `;

      const result = await client.query(query);

      // Format the response
      const users = result.rows.map(user => ({
        id: user.user_id,
        username: user.username,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
        status: {
          isActive: user.is_active,
          failedLoginAttempts: parseInt(user.recent_failed_attempts),
          isLocked: parseInt(user.recent_failed_attempts) >= MAX_LOGIN_ATTEMPTS
        },
        activity: {
          totalOrders: parseInt(user.total_orders),
          recentOrders: parseInt(user.recent_orders),
          lastLogin: user.last_login
        },
        metadata: {
          createdAt: user.created_at,
          createdBy: user.created_by_username,
          modifiedBy: user.modified_by_username
        }
      }));

      res.json({
        count: users.length,
        users
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ message: 'Server error' });
    } finally {
      client.release();
    }
  },

  // @desc    Update user profile
  // @route   PUT /api/auth/profile
  // @access  Private
  async updateProfile(req, res) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const userId = req.user.userId;
      const { full_name, email, phone_number, address, password } = req.body;
      
      // Check if email is already taken by another user
      if (email) {
        const emailCheck = await client.query(
          'SELECT user_id FROM users WHERE email = $1 AND user_id != $2',
          [email, userId]
        );
        
        if (emailCheck.rows.length > 0) {
          await client.query('ROLLBACK');
          return res.status(400).json({ message: 'Email is already in use' });
        }
      }
      
      // Build update query dynamically
      let updateFields = [];
      let queryParams = [];
      let paramCount = 1;
      
      if (full_name) {
        updateFields.push(`full_name = $${paramCount}`);
        queryParams.push(full_name);
        paramCount++;
      }
      
      if (email) {
        updateFields.push(`email = $${paramCount}`);
        queryParams.push(email);
        paramCount++;
      }
      
      if (phone_number) {
        updateFields.push(`phone_number = $${paramCount}`);
        queryParams.push(phone_number);
        paramCount++;
      }
      
      if (address) {
        updateFields.push(`address = $${paramCount}`);
        queryParams.push(address);
        paramCount++;
      }
      
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updateFields.push(`password_hash = $${paramCount}`);
        queryParams.push(hashedPassword);
        paramCount++;
      }
      
      // Add last_modified and modified_by
      updateFields.push(`last_modified = CURRENT_TIMESTAMP`);
      updateFields.push(`modified_by = $${paramCount}`);
      queryParams.push(userId);
      
      // Add user_id to params
      queryParams.push(userId);
      
      const updateQuery = `
        UPDATE users 
        SET ${updateFields.join(', ')}
        WHERE user_id = $${paramCount + 1}
        RETURNING user_id, username, full_name, email, role, phone_number, address, is_active
      `;
      
      const result = await client.query(updateQuery, queryParams);
      
      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ message: 'User not found' });
      }
      
      await client.query('COMMIT');
      
      // Return updated user data
      res.json({
        message: 'Profile updated successfully',
        user: result.rows[0]
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Server error' });
    } finally {
      client.release();
    }
  },
};

module.exports = authController;