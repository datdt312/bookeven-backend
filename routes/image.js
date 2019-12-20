const express = require('express');
const router = express.Router();

var imagesController = require('../controllers/imagesController');
var authController = require('../controllers/authController');

// Route vào các controller
router.post('/upload', authController.isAuthenticated, imagesController.upload_image);

module.exports = router;