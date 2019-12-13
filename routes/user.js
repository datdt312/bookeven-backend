const express = require('express');
const router = express.Router();

var usersController = require('../controllers/usersController');
var authController = require('../controllers/authController');

// Route vào các controller
router.get('/:id', authController.isAuthenticated, usersController.get_user_data);

module.exports = router;