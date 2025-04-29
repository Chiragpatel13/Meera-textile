const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');

// Admin routes with role-based access
router.get('/admin/users', auth, authorize('ADMIN'), userController.getAllUsers);
router.post('/admin/users', auth, authorize('ADMIN'), userController.createUser);
router.put('/admin/users/:id', auth, authorize('ADMIN'), userController.updateUser);
router.delete('/admin/users/:id', auth, authorize('ADMIN'), userController.deleteUser);

module.exports = router;