const jwt = require('jsonwebtoken');
const config = require('../helpers/config');

module.exports = {
    isAuthenticated = (req, res, next) => {
        if (req.headers &&
            req.headers.authorization &&
            req.headers.authorization.split(' ')[0] === 'JWT') {
            let jwtToken = req.headers.authorization.split(' ')[1];
            jwt.verify(jwtToken, config.jwtSecret, (err, payload) => {
                if (err) {
                    res.json({ message: "Unauthorized! Welcome to Login page!" });
                } else {
                    // check time expried
                    let now = new Date();
                    let currentTime = now.getTime();
                    let createdTime = payload.createdTime;
                    let differTime = (currentTime - createdTime) / 1000;

                    let jwtDecoded = jwt.decode(jwtToken);
                    let exp = jwtDecoded.exp;
                    if (differTime >= exp) {
                        res.json({ message: "Unauthorized! Welcome to Login page!" });
                    }

                    let email = payload.email;

                    database.query(`SELECT created_time_token FROM users WHERE email = ?`, [email], (err, rows, fields) => {
                        if (!err) {
                            if (rows.length > 0) {
                                var info = rows[0];
                                console.dir(info);

                                let created_time_token = info.created_time_token;

                                if (created_time_token === createdTime.toString()) {
                                    next();
                                } else {
                                    res.json({ message: "Unauthorized! Welcome to Login page!" });
                                }
                            } else {
                                res.json({ message: "Unauthorized! Welcome to Login page!" });
                            }
                        }
                    });
                }
            });
        }
    }
}