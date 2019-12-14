const express = require('express');
const router = express.Router();

var usersController = require('../controllers/usersController');
var authController = require('../controllers/authController');

// Route vào các controller
router.get('/info', authController.isAuthenticated, usersController.get_user_data);
router.put('/update', authController.isAuthenticated, usersController.update_user_data);
router.post('/password', authController.isAuthenticated, usersController.change_password);

module.exports = router;