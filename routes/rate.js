const express = require('express');
const router = express.Router();

var rateController = require('../controllers/rateController');
var authController = require('../controllers/authController');

// Route vào các controller
router.post('/addRate'/*, authController.isAuthenticated*/, rateController.addRate);
router.post('/listRate'/*, authController.isAuthenticated*/, rateController.list);
router.post('/updateRate'/*, authController.isAuthenticated*/, rateController.update);

module.exports = router;