const express = require('express');
const router = express.Router();

var ratesController = require('../controllers/ratesController');
var authController = require('../controllers/authController');

// Route vào các controller
router.post('/new', authController.isAuthenticated, ratesController.addRate);
router.post('/list', ratesController.list);
router.put('/update', authController.isAuthenticated, ratesController.update);

module.exports = router;