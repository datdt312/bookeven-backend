const express = require('express');
const router = express.Router();

var cartsController = require('../controllers/cartsController');
var authController = require('../controllers/authController');

// Route vào các controller
router.get('/list', authController.isAuthenticated, cartsController.get_cart_data);
router.post('/new', authController.isAuthenticated, cartsController.add_book_ver_hai_hai);
router.delete('/delete', authController.isAuthenticated, cartsController.remove_book);
router.put('/update', authController.isAuthenticated, cartsController.update_amount);

module.exports = router;