const express = require('express');
const router = express.Router();

var booksController = require('../controllers/booksController');
var authController = require('../controllers/authController');

// Route vào các controller
router.post('/detail', booksController.get_book_data);

module.exports = router;