const database = require('../database/connection');
const bcrypt = require('bcrypt');

exports.get_user_data = (req, res) => {
    try {
        var id = req.headers.id;

        database.query('SELECT id, email, fullname, phone, role FROM users WHERE id = ?', [id], (err, rows, fields) => {
            if (!err) {
                if (rows.length > 0) {
                    var info = rows[0];

                    res.status(200).json(info);
                } else {
                    res.status(202).json({ message: "Không xử lý được yêu cầu" });
                }
            } else {
                console.dir(err);
                res.status(500).json({ message: "Đã có lỗi xảy ra" });
            }
        });
    } catch (e) {
        res.status(500).json({ message: "Đã có lỗi xảy ra", _error: e });
    }
};

exports.update_user_data = (req, res) => {
    try {
        var body = req.body;
        var user_id = req.headers.id;

        database.query(`UPDATE users 
                        SET fullname = ?,
                            phone = ?
                        WHERE id = ?`,
            [body.fullname, body.phone, user_id],
            (err, rows, fields) => {
                if (!err) {
                    res.status(200).json({ message: "Cập nhật thông tin thành công" });
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

exports.change_password = (req, res) => {
    try {
        var old_password = req.body.old_password;
        var new_password = req.body.new_password;

        var user_id = req.headers.id;
        var email = req.headers.email;

        database.query(`SELECT password FROM users WHERE id = ? AND email = ?`, [user_id, email], (err, rows, fields) => {
            if (!err) {
                if (rows.length > 0) {
                    var info = rows[0];

                    const match = bcrypt.compareSync(old_password, info.password);

                    if (match) {
                        var hash_password = bcrypt.hashSync(new_password, 10);


                        database.query(`UPDATE users SET password = ? WHERE id = ? AND email = ?`, [hash_password, user_id, email], (err, rows, fields) => {
                            if (!err) {
                                res.status(200).json({ message: "Đổi mật khẩu thành công" })
                            } else {
                                console.dir(err);
                                res.status(202).json({ message: "Không xử lý được yêu cầu" });
                            }
                        });
                    } else {
                        res.status(202).json({ message: "Mật khẩu cũ không đúng" });
                    }
                } else {
                    res.status(202).json({ message: "Không xử lý được yêu cầu" });
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