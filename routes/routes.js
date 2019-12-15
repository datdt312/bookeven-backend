const authController = require('../controllers/authController');

const router = app => {

    app.get('/', (request, response) => {
        response.send('<h1 style="transform: translate(200px, 200px);">chào mừng hải hải đến với thế giới api</h1>');
    });

    app.use('/apis', require('./auth'));
    app.use('/apis/user', require('./user'));
    app.use('/apis/bookfield', require('./bookfield'));
    app.use('/apis/address', require('./address'));
    app.use('/apis/cart', require('./cart'));
    app.use('/apis/comment', require('./comment'));
    app.use('/apis/order', require('./order'));
    app.use('/apis/book', require('./book'));

}

module.exports = router;
