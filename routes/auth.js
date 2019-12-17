const express = require('express');
const router = express.Router();

var usersController = require('../controllers/usersController');
var authController = require('../controllers/authController');

// Route vào các controller
router.post('/signup', authController.signup);

router.post('/signup/manager', authController.signup_manager);

router.post('/login', authController.login);

router.get('/logout', authController.logout);

module.exports = router;