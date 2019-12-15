const express = require('express');
const router = express.Router();

var ordersController = require('../controllers/ordersController');
var authController = require('../controllers/authController');

// Route vào các controller
router.get('/list' , ordersController.list);
router.post('/filter', ordersController.filter);
router.post('/detail', authController.isAuthenticated, ordersController.detail);
router.post('/new', authController.isAuthenticated, ordersController.add_order);
router.put('/update', ordersController.update);

module.exports = router;