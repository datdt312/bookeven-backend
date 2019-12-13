var express = require("express");
var bodyParser = require('body-parser');
var routes = require('./routes/routes');
var logger = require('morgan');
var app = express();

const port = process.env.PORT || 1999;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, , authorization, email");
    next();
});


routes(app);

const server = app.listen(port, (error) => {
    if (error)
        return console.log(`Error: ${error}`);
    console.log(`Server is listen on port ${server.address().port}`);
});
