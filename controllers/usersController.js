const database = require('../database/connection');
const bcrypt = require('bcrypt');

exports.get_user_data = (req, res) => {
    try {
        var body = req.params;

        database.query('SELECT id, email, fullname, phone, role FROM users WHERE id = ?', [body.id], (err, rows, fields) => {
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
        var id = req.params.id;
        var hash_password = bcrypt.hashSync(body.password, 10);

        database.query(`UPDATE users 
                        SET fullname = ?,
                            phone = ?,
                            password = ?
                        WHERE id = ?`,
            [body.fullname, body.phone, hash_password, id],
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