const database = require('../database/connection');

exports.get_all_comment_on_book = (req, res) => {
    try {
        var book_id = req.body.id;

        const string_query = `SELECT
                                    c.id,
                                    u.user_id,
                                    u.fullname,
                                    c.comment,
                                    c.created_date
                                FROM comments c
                                RIGHT JOIN users u
                                ON c.user_id = u.id
                                WHERE c.is_deleted = false
                                AND c.book_id = ${book_id}
                                ORDER BY c.id`;

        database.query(string_query, (err, rows, fields) => {
            if (!err) {
                res.status(200).json(rows);
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


exports.add_comment = (req, res) => {
    try {
        var user_id = req.headers.id;
        var book_id = req.body.book_id;
        var date = req.body.date;
        var comment = req.body.comment;

        database.query(`INSERT INTO comments(book_id, user_id, created_date, comment, is_deleted) VALUE (?,?,?,?,0);
                        SELECT LAST_INSERT_ID() AS 'comment_id' FROM comments `, [book_id, user_id, date, comment], (err, rows, fields) => {
            if (!err) {
                console.dir(rows);
                if (rows.length > 0) {
                    var info = rows[1][0];
                    console.dir(info);
                    res.status(201).json({ comment_id: info.comment_id, message: "Đăng bình luận thành công" });
                } else {
                    res.status(202).json({ message: "Không thực hiện được yêu cầu" });
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

exports.update_comment = (req, res) => {
    try {
        var user_id = req.headers.id;
        var comment_id = req.body.comment_id;
        var date = req.body.date;
        var comment = req.body.comment;

        database.query(`UPDATE comments SET comment = ?, modified_date = ? WHERE user_id = ? AND id = ?`, [comment, date, user_id, comment_id], (err, rows, fields) => {
            if (!err) {
                res.status(200).json({ message: "Sửa bình luận thành công" })
            } else {
                console.dir(err);
                res.status(500).json({ message: "Đã có lỗi xảy ra" });
            }
        });
    } catch (e) {
        console.dir(e);
        res.status(500).json({ message: "Đã có lỗi xảy ra" });
    }
}

exports.remove_comment = (req, res) => {
    try {
        var user_id = req.headers.id;
        var comment_id = req.body.comment_id;

        database.query(`UPDATE comments SET is_deleted = 1 WHERE id = ? AND user_id = ?`, [comment_id, user_id], (err, rows, fields) => {
            if (!err) {
                res.status(200).json({ message: "Xóa bình luận thành công" })
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
