const express = require('express');
const router = express.Router();

var rateController = require('../controllers/rateController');
var authController = require('../controllers/authController');

// Route vào các controller
router.post('/neww'/*, authController.isAuthenticated*/, rateController.addRate);
router.post('/list'/*, authController.isAuthenticated*/, rateController.list);
router.put('/update'/*, authController.isAuthenticated*/, rateController.update);

module.exports = router;