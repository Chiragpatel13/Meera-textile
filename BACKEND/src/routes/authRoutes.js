const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth, authorize } = require('../middleware/auth');

// Public routes
router.post('/login', authController.login);

// Protected routes
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, authController.updateProfile);

// Admin routes
router.post(
  '/users',
  auth,
  authorize('ADMIN'),
  authController.createUser
);

router.patch(
  '/users/:id/status',
  auth,
  authorize('ADMIN'),
  authController.updateUserStatus
);

// Store Manager routes
router.get(
  '/users',
  auth,
  authorize('ADMIN', 'STORE_MANAGER'),
  authController.getUsers
);

// Export router
module.exports = router;