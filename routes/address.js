const express = require('express');
const router = express.Router();

var addressController = require('../controllers/addressController');
var authController = require('../controllers/authController');

// Route vào các controller
router.get('/info', authController.isAuthenticated, addressController.get_user_data);

module.exports = router;