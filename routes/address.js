const express = require('express');
const router = express.Router();

var addressController = require('../controllers/addressController');
var authController = require('../controllers/authController');

// Route vào các controller
router.get('/list', addressController.get_user_address);
router.post('/new', addressController.new);
router.put('/update', addressController.update);
router.delete('/delete', addressController.delete);

module.exports = router;