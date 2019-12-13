const authController = require('../controllers/authController');

const router = app => {

    app.get('/', (request, response) => {
        response.send({
            message: 'Node.js and Express REST API'
        });
    });

    app.use('/apis', require('./auth'));
    app.use('/apis/user', require('./user'));
    app.use('/apis/bookfield', require('./bookfield'));
    app.use('/apis/address', require('./address'));
    app.use('/apis/cart', require('./cart'));
}

module.exports = router;