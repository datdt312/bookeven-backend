const database = require('../database/connection');
const config = require('../helpers/config');
const utils = require('../helpers/utils');

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

exports.add_new_book = (req, res) => {
    try {
        var body = req.body;

        var book = [
            { key: "name", value: `${body.title}` },
            { key: "author", value: `${body.author}` },
            { key: "size", value: `${body.size}` },
            { key: "page", value: `${body.numPage}` },
            { key: "weight", value: `${body.weight}` },
            { key: "published_date", value: `${body.publishDate}` },
            { key: "price", value: parseInt(body.price) },
            { key: "bookfield_id", value: parseInt(body.bookField) },
            { key: "description", value: `${body.description}` },
            { key: "image", value: `${body.image}` },
            { key: "inventory", value: parseFloat(body.inventory) },
            { key: "discount", value: parseFloat(body.discount) }
        ];

        indexes = book.map(e => e.key).join(', ');
        values = book.map(e => {
            if (utils.isInt(e.value))
                return e.value;
            return `\'${e.value}\'`;
        }).join(', ');

        var query_string = `INSERT INTO books(${indexes}) VALUE (${values})`;

        database.query(`${query_string};
                        SELECT LAST_INSERT_ID() AS 'id' FROM books`, (err, rows, fields) => {
            if (!err) {
                var id = rows[1][0];
                res.status(201).json({ id: id, message: "Đã thêm sách thành công" });
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

exports.update_book = (req, res) => {
    try {
        var body = req.body;

        var book = [
            { key: "name", value: `${body.title}` },
            { key: "author", value: `${body.author}` },
            { key: "size", value: `${body.size}` },
            { key: "page", value: `${body.numPage}` },
            { key: "weight", value: `${body.weight}` },
            { key: "published_date", value: `${body.publishDate}` },
            { key: "price", value: parseInt(body.price) },
            { key: "bookfield_id", value: parseInt(body.bookField) },
            { key: "description", value: `${body.description}` },
            { key: "image", value: `${body.image}` },
            { key: "inventory", value: parseFloat(body.inventory) },
            { key: "discount", value: parseFloat(body.discount) }
        ];

        set_values = book.map(e => `${e.key} = \'${e.value}\'`).join(', ');

        var query_string = `UPDATE books SET ${set_values} WHERE id = ${body.id}`;

        database.query(query_string, (err, rows, fields) => {
            if (!err) {
                res.status(200).json({ message: "Đã cập nhật sách thành công" });
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

exports.delete_book = (req, res) => {
    try {
        var book_id = req.body.id;

        database.query(`DELETE FROM books WHERE id = ?`, [book_id], (err, rows, fields) => {
            if (!err) {
                res.status(200).json({ message: "Đã xóa sách thành công" });
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