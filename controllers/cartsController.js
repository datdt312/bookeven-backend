const database = require('../database/connection');

exports.get_cart_data = (req, res) => {
    try {
        var body = req.body;
        var id = req.params.id;

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