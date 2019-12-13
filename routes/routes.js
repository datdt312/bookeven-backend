const authController = require('../controllers/authController');

const router = app => {

    app.get('/', (request, response) => {
        response.send('<h1 style="transform: translate(50%, 200px);">chào mừng hải hải đến với thế giới api</h1>');
    });

    app.use('/apis', require('./auth'));
    app.use('/apis/user', require('./user'));
    app.use('/apis/bookfield', require('./bookfield'));
    app.use('/apis/address', require('./address'))
}

module.exports = router;
