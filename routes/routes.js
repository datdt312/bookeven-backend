const authController = require('../controllers/authController');

const router = app => {

    app.get('/', (request, response) => {
        response.send({
            message: 'Node.js and Express REST API'
        });
    });

    app.use('/apis', require('./auth'));
    app.use('/apis/user', require('./user'));
}

module.exports = router;