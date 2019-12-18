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
                    res.status(202).json({ message: "Email đã được sử dụng" });
                }
                else {
                    var hash_password = bcrypt.hashSync(body.password, 10);
                    database.query(`INSERT INTO users(fullname, email, password, phone, role) 
                                    VALUE (?,?,?,?,1)`,
                        [body.fullname, body.email, hash_password, body.phone],
                        (err, rows, fields) => {
                            if (!err) {
                                res.status(200).json({ message: "Đăng ký thành công" });
                            } else {
                                console.dir(err);
                                res.status(500).json({ message: "Đã có lỗi xảy ra" });
                            }
                        });
                }
            } else {
                console.dir(err);
                res.status(500).json({ message: "Đã có lỗi xảy ra" });
            }
        });
    } catch (e) {
        console.dir(e);
        res.status(500).json({ message: "Đã có lỗi xảy ra" });
    }
};

exports.login = (req, res) => {
    try {
        const body = req.body;

        database.query(`SELECT id, email, password, fullname, role FROM users WHERE email = ?`, [body.email], (err, rows, feilds) => {
            if (!err) {
                if (rows.length > 0) {
                    var info = rows[0];
                    const match = bcrypt.compareSync(body.password, info.password);

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
                        database.query('UPDATE users SET created_time_token = ? WHERE email = ?', [createdTime, body.email], (err, rows, feilds) => {
                            if (!err) {
                                res.status(200).json(jsonResponse);
                            } else {
                                console.dir(err);
                                res.status(500).json({ message: "Đã có lỗi xảy ra" });
                            }
                        });

                    } else {
                        res.status(202).json({ message: 'Mật khẩu không đúng' })
                    }
                }
                else {
                    res.status(202).json({ message: 'Tên đăng nhập không đúng' })
                }
            } else {
                console.dir(err);
                res.status(500).json({ message: "Đã có lỗi xảy ra" });
            }
        });
    } catch (e) {
        console.dir(e);
        res.status(500).json({ message: "Đã có lỗi xảy ra" });
    }
};

exports.logout = (req, res) => {
    try {
        const body = req.body;

        var payload = { email: body.email };
        var jwtToken = jwt.sign(payload, config.jwtSecret, { expiresIn: '1' });

        res.status(200).json({ message: "Đăng xuất thành công" });
    } catch (e) {
        console.dir(e);
        res.status(500).json({ message: "Đã có lỗi xảy ra" });
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
                    // check time expried

                    let now = new Date();
                    let currentTime = now.getTime();
                    let createdTime = payload.iat;
                    let differTime = (currentTime - createdTime) / 1000;

                    let exp = payload.exp;
                    if (differTime >= exp) {
                        res.status(401).json({ message: "Xác thực không thành công!" });
                        return;
                    }

                    let email = payload.email;
                    if (req.headers.email === payload.email) {
                        database.query(`SELECT created_time_token FROM users WHERE email = ?`, [email], (err, rows, fields) => {
                            if (!err) {
                                if (rows.length > 0) {
                                    var info = rows[0];

                                    let created_time_token = info.created_time_token;

                                    if (created_time_token === createdTime.toString()) {
                                        next();
                                    } else {
                                        res.status(401).json({ message: "Xác thực không thành công!" });
                                    }
                                } else {
                                    res.status(401).json({ message: "Xác thực không thành công!" });
                                }
                            }
                        });
                    } else {
                        res.status(401).json({ message: "Xác thực không thành công!" });
                    }
                } else {
                    console.dir(err);
                    res.status(401).json({ message: "Xác thực không thành công!" });
                }
            });
        }
    } catch (e) {
        console.dir(e);
        res.status(500).json({ message: "Đã có lỗi xảy ra", _error: e });
    }
}