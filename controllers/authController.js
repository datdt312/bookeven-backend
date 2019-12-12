const database = require('../database/connection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../helpers/config');

exports.signup = (req, res) => {
    try {
        const body = req.body;
        database.query(`SELECT * FROM users WHERE Email = ?`, [body.email], (err, rows, feilds) => {
            if (!err) {
                if (rows.length > 0) {
                    res.status(400).json({ message: "Email has been used!" });
                }
                else {
                    var hash_password = bcrypt.hashSync(body.password, 10);
                    database.query(`INSERT INTO users(fullname, email, password, phone, role) 
                                    VALUE (?,?,?,?,1)`,
                        [body.fullname, body.email, hash_password, body.phone],
                        (err, rows, fields) => {
                            if (!err) {
                                res.status(200).json({ message: "Registed successfully!" });
                            } else {
                                console.log(err);
                                res.status(400).json({ message: "Something went wrong!" });
                            }
                        });
                }
            } else {
                console.log(err);
                res.status(400).json({ message: "Something went wrong!" });
            }
        });
    } catch (e) {
        res.status(400).json({ message: "Something went wrong!", _error: e });
    }
};

exports.login = (req, res) => {
    try {
        const body = req.body;
        console.dir(body);


        database.query(`SELECT id, email, password, fullname, role FROM users WHERE email = ?`, [body.email], (err, rows, feilds) => {
            if (!err) {
                if (rows.length > 0) {
                    var info = rows[0];
                    console.dir(info);
                    const match = bcrypt.compareSync(body.password, info.password);
                    console.log(match);

                    if (match) {
                        console.log('correct');
                        var payload = { email: body.email };
                        var jwtToken = jwt.sign(payload, config.jwtSecret, { expiresIn: '30d' });
                        console.log('jwtToken: ' + jwtToken);
                        var jsonResponse = {
                            'id': info.id,
                            'email': info.email,
                            'fullname': info.fullname,
                            'role': info.role,
                            'token': jwtToken
                        };
                        var createdTime = jwt.decode(jwtToken).iat;
                        console.log(createdTime);
                        database.query('UPDATE users SET created_time_token = ? WHERE email = ?', [createdTime, body.email], (err, rows, feilds) => {
                            if (!err) {
                                res.status(200).json(jsonResponse);
                            } else {
                                console.log(err);
                                res.status(400).json({ message: "Something went wrong!q" });
                            }
                        });

                    } else {
                        res.status(400).json({ error: 'Email or password has been slain!' })
                    }
                }
                else {
                    res.status(400).json({ error: 'Email or password has been slain!' })
                }
            } else {
                console.log(err);

                res.status(400).json({ message: "Something went wrong!" });
            }
        });
    } catch (e) {
        res.status(400).json({ message: "Something went wrong!", _error: e });
    }
};

exports.logout = (req, res) => {
    try {
        const body = req.body;

        var payload = { email: body.email };
        var jwtToken = jwt.sign(payload, config.jwtSecret, { expiresIn: '1' });

        res.status(200).json({ message: "Logout successfully!" });
    } catch (e) {
        res.status(400).json({ message: "Something went wrong!", _error: e });
    }
};

exports.isAuthenticated = (req, res, next) => {
    try {
        if (req.headers &&
            req.headers.authorization &&
            req.headers.authorization.split(' ')[0] === 'Bearer') {
            let jwtToken = req.headers.authorization.split(' ')[1];
            jwt.verify(jwtToken, config.jwtSecret, (err, payload) => {
                if (!err) {
                    console.dir(payload);
                    console.dir(req.headers.authorization);
                    // check time expried

                    let now = new Date();
                    let currentTime = now.getTime();
                    let createdTime = payload.iat;
                    let differTime = (currentTime - createdTime) / 1000;

                    let exp = payload.exp;
                    if (differTime >= exp) {
                        res.status(400).json({ message: "Unauthorized! Welcome to Login page!" });
                        return;
                    }

                    let email = payload.email;

                    database.query(`SELECT created_time_token FROM users WHERE email = ?`, [email], (err, rows, fields) => {
                        if (!err) {
                            if (rows.length > 0) {
                                var info = rows[0];

                                let created_time_token = info.created_time_token;
                                console.log(typeof (created_time_token) + created_time_token);
                                console.log(typeof (createdTime.toString()) + createdTime.toString());

                                if (created_time_token === createdTime.toString()) {
                                    next();
                                } else {
                                    res.status(400).json({ message: "Unauthorized! Welcome to Login page!" });
                                }
                            } else {
                                res.status(400).json({ message: "Unauthorized! Welcome to Login page!" });
                            }
                        }
                    });
                } else {
                    res.status(400).json({ message: "Unauthorized! Welcome to Login page!" });
                }
            });
        }
    } catch (e) {
        res.status(400).json({ message: "Something went wrong!", _error: e });
    }
}