const express = require('express');
const router = express.Router();

var commentsController = require('../controllers/commentsController');
var authController = require('../controllers/authController');

// Route vào các controller
router.post('/list', commentsController.get_all_comment_on_book);
router.post('/new', authController.isAuthenticated, commentsController.add_comment);
router.put('/update', authController.isAuthenticated, commentsController.update_comment);
router.delete('/delete', authController.isAuthenticated, commentsController.remove_comment);

module.exports = router;