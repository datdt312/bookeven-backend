const express = require('express');
const router = express.Router();

var bookfieldController = require('../controllers/bookfieldController');

router.get('/list', bookfieldController.list);

module.exports = router;