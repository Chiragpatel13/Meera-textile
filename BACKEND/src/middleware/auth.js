const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

// Role hierarchy definition
const ROLE_HIERARCHY = {
  'ADMIN': ['ADMIN', 'STORE_MANAGER', 'SALES_STAFF', 'INVENTORY_STAFF'],
  'STORE_MANAGER': ['STORE_MANAGER', 'SALES_STAFF', 'INVENTORY_STAFF'],
  'SALES_STAFF': ['SALES_STAFF'],
  'INVENTORY_STAFF': ['INVENTORY_STAFF']
};

// JWT secret (move this to environment variables in production)
const JWT_SECRET = 'meera-textile-secret-key-2025';

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token provided' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if user still exists and is active
    const result = await pool.query(
      'SELECT user_id, username, role, is_active FROM users WHERE user_id = $1',
      [decoded.userId]
    );
    
    const user = result.rows[0];
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    if (!user.is_active) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }
    
    // Add user info to request
    req.user = {
      userId: user.user_id,
      username: user.username,
      role: user.role
    };
    
    next();
  } catch (error) {
    console.error('Auth error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Role-based authorization middleware
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    
    if (!userRole) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Get all roles this user can access based on hierarchy
    const accessibleRoles = ROLE_HIERARCHY[userRole] || [];
    
    // Check if user has permission for any of the allowed roles
    const hasPermission = allowedRoles.some(role => accessibleRoles.includes(role));
    
    if (!hasPermission) {
      return res.status(403).json({ 
        message: 'Access denied. Insufficient permissions.',
        required: allowedRoles,
        userRole: userRole
      });
    }
    
    next();
  };
};

module.exports = { auth, authorize, JWT_SECRET };