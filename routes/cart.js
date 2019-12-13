const express = require('express');
const router = express.Router();

var cartsController = require('../controllers/cartsController');
var authController = require('../controllers/authController');

// Route vào các controller
router.post('/new', authController.isAuthenticated, cartsController.add_book);
router.post('/delete/:book_id', authController.isAuthenticated, cartsController.remove_book);
router.post('/update', authController.isAuthenticated, cartsController.update_amount);

module.exports = router;