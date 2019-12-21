const database = require('../database/connection');

exports.addRate = (req, res) => {
	try {
		let book_id = req.body.book_id;
		let rate = req.body.rate;
		let user_id = req.headers.id;
		database.query(`INSERT INTO rates(user_id, book_id, rate) VALUE (?, ?, ?)`, [user_id, book_id, rate], (err, rows, fields) => {
			if (!err) {
				console.log(rows);
				res.status(201).json({message: "Rate thành công"});
            } else {
                res.status(500).json({ message: "Đã có lỗi xảy ra" + err});
            }
        });

    } catch(e){
        res.status(500).json({message: "Đã có lỗi xảy ra", _error: e})
    }
}

exports.list = (req, res) => {
	try {
		let book_id = req.body.book_id;
		database.query(`SELECT u.fullname, rate from rates 
						RIGHT JOIN users u ON rates.user_id = u.id
						WHERE book_id = ?`
						, [book_id], (err, rows, fields) => {
			if (!err) {
				if (rows.length > 0) {
					let rateList = rows;
					res.status(200).json(rateList);
				}
            } else {
                res.status(500).json({ message: "Đã có lỗi xảy ra" + err});
            }
		});

		} catch(e){
        res.status(500).json({message: "Đã có lỗi xảy ra", _error: e})
	}
}

exports.update = (req, res) => {
	try {
		let book_id = req.body.book_id;
		let rate = req.body.rate;
		let user_id = req.headers.id;
		database.query(`UPDATE rates SET rate = ? WHERE user_id = ? AND book_id = ?;`, [rate, user_id, book_id], (err, rows, fields) => {
			if (!err) {
				res.status(200).json({message: "update rate thanh cong"});
            } else {
                res.status(500).json({ message: "Đã có lỗi xảy ra" + err});
            }
		});

	}catch (e) {
		res.status(500).json({message: "Đã có lỗi xảy ra", _error: e})
	}
}