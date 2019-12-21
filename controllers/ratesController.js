const database = require('../database/connection');

exports.addRate = (req, res) => {
	try {
		let book_id = req.body.book_id;
		let rate = req.body.rate;
		let user_id = req.headers.id;
		database.query(`INSERT INTO rates(user_id, book_id, rate) VALUE (?, ?, ?)`, [user_id, book_id, rate], (err, rows, fields) => {
			if (!err) {
				console.log(rows);
				res.status(201).json({ message: "Rate thành công" });
			} else {
				res.status(500).json({ message: "Đã có lỗi xảy ra" + err });
			}
		});

	} catch (e) {
		res.status(500).json({ message: "Đã có lỗi xảy ra", _error: e })
	}
}

exports.list = (req, res) => {
	try {
		let book_id = req.body.book_id;

		var rate1 =
			`SELECT COUNT(*) AS 'rate1' FROM rates WHERE book_id = ${book_id} AND rate = 1`;
		var rate2 =
			`SELECT COUNT(*) AS 'rate2' FROM rates WHERE book_id = ${book_id} AND rate = 2`;
		var rate3 =
			`SELECT COUNT(*) AS 'rate3' FROM rates WHERE book_id = ${book_id} AND rate = 3`;
		var rate4 =
			`SELECT COUNT(*) AS 'rate4' FROM rates WHERE book_id = ${book_id} AND rate = 4`;
		var rate5 =
			`SELECT COUNT(*) AS 'rate5' FROM rates WHERE book_id = ${book_id} AND rate = 5`;
		var total =
			`SELECT COUNT(*) AS 'totalrate' FROM rates WHERE book_id = ${book_id}`;
		var list = `SELECT u.fullname, rate from rates 
					RIGHT JOIN users u ON rates.user_id = u.id
					WHERE book_id = ${book_id}`
		var totalRate = `SELECT ROUND(AVG(rate), 1) AS rate FROM rates WHERE book_id = ${book_id} GROUP BY book_id`;
		database.query(`${total};${rate1};${rate2};${rate3};${rate4};${rate5};${list};${totalRate}`,
			(err, rows, fields) => {
				if (!err) {
					var rateList = rows[6];
					var totalrate = rows[0][0].totalrate;
					var r1 = Math.round(rows[1][0].rate1 / totalrate * 100);
					var r2 = Math.round(rows[2][0].rate2 / totalrate * 100);
					var r3 = Math.round(rows[3][0].rate3 / totalrate * 100);
					var r4 = Math.round(rows[4][0].rate4 / totalrate * 100);
					var r5 = Math.round(rows[5][0].rate5 / totalrate * 100);

					var ratesPercent = { r1, r2, r3, r4, r5 };

					var totalRate = rows[7][0].rate;

					res.status(200).json({ rateList, ratesPercent, totalRate });
				} else {
					console.dir(err);
					res.status(500).json({ message: "Đã có lỗi xảy ra" + err });
				}
			});
	} catch (e) {
		res.status(500).json({ message: "Đã có lỗi xảy ra", _error: e })
	}
}

exports.update = (req, res) => {
	try {
		let book_id = req.body.book_id;
		let rate = req.body.rate;
		let user_id = req.headers.id;
		database.query(`UPDATE rates SET rate = ? WHERE user_id = ? AND book_id = ?;`, [rate, user_id, book_id], (err, rows, fields) => {
			if (!err) {
				res.status(200).json({ message: "update rate thanh cong" });
			} else {
				res.status(500).json({ message: "Đã có lỗi xảy ra" + err });
			}
		});

	} catch (e) {
		res.status(500).json({ message: "Đã có lỗi xảy ra", _error: e })
	}
}