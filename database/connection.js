const mysql = require('mysql');
const config = require('../helpers/config');

const mysqlConnection = mysql.createConnection(config.sqlDevDB);
//const mysqlConnection = mysql.createConnection(config.sqlClearDB);

mysqlConnection.connect(function (err) {
    if (err) {
        console.error(err);
        return;
    } else {
        console.log('Database is connected');
    }
});

module.exports = mysqlConnection;