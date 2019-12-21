const express = require('express');
const router = express.Router();

var ratesController = require('../controllers/ratesController');
var authController = require('../controllers/authController');

// Route vào các controller
router.post('/new', authController.isAuthenticated, rateController.addRate);
router.post('/list', rateController.list);
router.put('/update', authController.isAuthenticated, rateController.update);

module.exports = router;