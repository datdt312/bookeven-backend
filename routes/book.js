const express = require('express');
const router = express.Router();

var booksController = require('../controllers/booksController');
var authController = require('../controllers/authController');

// Route vào các controller
router.post('/detail', booksController.get_book_data);
router.post('/new', authController.isAuthenticated, booksController.add_new_book);
router.put('/update', authController.isAuthenticated, booksController.update_book);
router.delete('/delete', authController.isAuthenticated, booksController.delete_book);


router.post('/list', booksController.list_book_by_field);
router.post('/newest', booksController.list_book_newest);
router.post('/bestRate', booksController.list_book_best_rate);

router.post('/filter', booksController.filter);

module.exports = router;