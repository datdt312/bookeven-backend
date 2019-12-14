const database = require('../database/connection');

exports.get_cart_data = (req, res) => {
    try {
        var body = req.body;
        var user_id = req.headers.id;

        database.query(` `, [], (err, rows, fields) => { });
    } catch (e) {
        console.dir(e);
        res.status(500).json({ message: "Đã có lỗi xảy ra" });
    }
};


exports.add_book = (req, res) => {
    try {
        var user_id = req.headers.id;
        var book_id = req.body.book_id;
        var amount = req.body.amount;

        database.query(`INSERT INTO carts(book_id, user_id, amount) VALUE (?,?,?) `, [book_id, user_id, amount], (err, rows, fields) => {
            if (!err) {
                res.status(200).json({ message: "Thêm sách vào giỏ thành công" })
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

exports.add_book_ver_hai_hai = (req, res) => {
    try {
        var user_id = req.headers.id;
        var book_id = req.body.book_id;
        var amount = req.body.amount;

        database.query(`SELECT * FROM carts WHERE book_id = ?`, [book_id], (err, rows, fields) => {
            if (!err) {
                if (rows.length > 0) {
                    var info = rows[0];
                    var newreq = req;

                    req.body.amount = (parseInt(info.amount) + parseInt(amount));

                    this.update_amount(req, res);
                } else {
                    this.add_book(req, res);
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

exports.remove_book = (req, res) => {
    try {
        var user_id = req.headers.id;
        var book_id = req.params.book_id;

        database.query(`DELETE FROM carts WHERE book_id = ? AND user_id = ?`, [book_id, user_id], (err, rows, fields) => {
            if (!err) {
                res.status(200).json({ message: "Bỏ sách ra khỏi giỏ thành công" })
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

exports.update_amount = (req, res) => {
    try {
        var amount = req.body.amount;
        var user_id = req.headers.id;
        var book_id = req.body.book_id;

        database.query(`UPDATE carts SET amount = ? WHERE book_id = ? AND user_id = ?`, [amount, book_id, user_id], (err, rows, fields) => {
            if (!err) {
                res.status(200).json({ message: "Cập nhật số lượng thành công" })
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

exports.remove_all_book = (user_id) => {
    try {
        database.query('DELETE FROM carts WHERE user_id = ?', [user_id], (err, rows, fields) => {
            if (!err) {
                return true;
            } else {
                return false;
            }
        })
    } catch (e) {
        console.dir(e);
        return false;
    }
};