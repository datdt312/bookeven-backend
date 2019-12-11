const express = require('express');
const router = express.Router();
const database = require('../database/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../helpers/config');

router.post('/signup', (req, res) => {

    const body = req.body;
    //console.dir(body);
    database.query(`SELECT * FROM users WHERE Email = ?`, [body.email], (err, rows, feilds) => {
        if (!err) {
            if (rows.length > 0) {
                res.json({ message: "Email has been used!" });
            }
            else {
                var hash_password = bcrypt.hashSync(body.password, 10);
                database.query(`INSERT INTO users(fullname, email, password, phone, role) 
                                VALUE (?,?,?,?,1)`,
                    [body.fullname, body.email, hash_password, body.phone],
                    (err, rows, fields) => {
                        if (!err) {
                            res.json({ message: "Registed successfully!" })
                        } else {
                            console.log(err);
                            res.json({ message: "Something went wrong!" });
                        }
                    });
            }
        } else {
            console.log(err);
            res.json({ message: "Something went wrong!" });
        }
    });
});

router.post('/login', (req, res) => {
    const body = req.body;
    console.dir(body);


    database.query(`SELECT * FROM users WHERE email = ?`, [body.email], (err, rows, feilds) => {
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
                    var jsonResponse = { 'access_token': jwtToken };
                    var createdTime = new Date().getTime().toString();
                    database.query('UPDATE users SET created_time_token = ? WHERE email = ?', [createdTime, body.email], (err, rows, feilds) => {
                        if (!err) {
                            res.json(jsonResponse);
                        } else {
                            console.log(err);
                            res.json({ message: "Something went wrong!" });
                        }
                    });

                } else {
                    res.json({ error: 'Email or password has been slain!' })
                }
            }
            else {
                res.json({ error: 'Email or password has been slain!' })
            }
        } else {
            console.log(err);

            res.json({ message: "Something went wrong!" });
        }
    });
});

router.post('/logout', (req, res) => {
    const body = req.body;

    var payload = { email: body.email };
    var jwtToken = jwt.sign(payload, config.jwtSecret, { expiresIn: '1' });

    res.json({ message: "Logout successfully!" });
});
module.exports = router;