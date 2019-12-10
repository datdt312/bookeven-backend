const router = app => {

    app.get('/', (request, response) => {
        response.send({
            message: 'Node.js and Express REST API'
        });
    });

    app.use('/apis', require('../controllers/usersController'));

}

module.exports = router;