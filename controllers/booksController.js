const database = require('../database/connection');
const config = require('../helpers/config');

exports.get_book_data = (req, res) => {
    try {
        var book_id = req.body.id;
        var query_string = `SELECT 
                                b.id, 
                                b.name, 
                                b.author, 
                                b.size,
                                b.page,
                                b.weight,
                                b.published_date,
                                b.price,
                                b.image,
                                b.description,
                                b.discount,
                                bf.name AS 'bookfield'
                            FROM books b
                            LEFT JOIN bookfields bf
                            ON b.bookfield_id = bf.id
                            WHERE b.id = ${book_id}`;
        database.query(query_string, (err, rows, fields) => {
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
        console.dir(e);
        res.status(500).json({ message: "Đã có lỗi xảy ra" });
    }
};