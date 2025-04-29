const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { auth, authorize } = require('../middleware/auth');

// All routes require authentication
router.get('/search', auth, authorize('ADMIN', 'STORE_MANAGER', 'SALES_STAFF'), customerController.searchCustomers);
router.get('/', auth, authorize('ADMIN', 'STORE_MANAGER', 'SALES_STAFF'), customerController.getAllCustomers);
router.get('/:id', auth, authorize('ADMIN', 'STORE_MANAGER', 'SALES_STAFF'), customerController.getCustomerById);
router.post('/', auth, authorize('ADMIN', 'STORE_MANAGER'), customerController.createCustomer);
router.put('/:id', auth, authorize('ADMIN', 'STORE_MANAGER'), customerController.updateCustomer);

module.exports = router;
