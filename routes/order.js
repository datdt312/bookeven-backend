const express = require('express');
const router = express.Router();

var ordersController = require('../controllers/ordersController');
var authController = require('../controllers/authController');

// Route vào các controller
router.get('/list', authController.isAuthenticated, ordersController.list);
router.post('/filter', authController.isAuthenticated, ordersController.filter);
router.post('/detail', authController.isAuthenticated, ordersController.detail);
router.post('/new', authController.isAuthenticated, ordersController.add_order);
router.put('/update', authController.isAuthenticated, ordersController.update);

module.exports = router;