const express = require('express');
const router = express.Router();

var addressController = require('../controllers/addressController');
var authController = require('../controllers/authController');

// Route vào các controller
router.get('/list', authController.isAuthenticated, addressController.get_user_address);
router.post('/new', authController.isAuthenticated, addressController.new);
router.put('/update', authController.isAuthenticated, addressController.update);
router.delete('/delete', authController.isAuthenticated, addressController.delete);

module.exports = router;