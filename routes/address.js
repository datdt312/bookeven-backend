const express = require('express');
const router = express.Router();

var addressController = require('../controllers/addressController');
var authController = require('../controllers/authController');

router.get('/list', authController.isAuthenticated, addressController.get_user_address);

module.exports = router;