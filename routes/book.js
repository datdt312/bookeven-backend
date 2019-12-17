const express = require('express');
const router = express.Router();

var booksController = require('../controllers/booksController');
var authController = require('../controllers/authController');

// Route vào các controller
router.post('/detail', booksController.get_book_data);
router.post('/new', booksController.add_new_book);
router.put('/update', booksController.update_book);
router.delete('/delete', booksController.delete_book);

module.exports = router;