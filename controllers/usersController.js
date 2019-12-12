const database = require('../database/connection');

exports.get_user_data = (req, res) => {
    try {
        var body = req.body;

        database.query('SELECT id, email, fullname, phone, role FROM users WHERE id = ?', [body.id], (err, rows, fields) => {
            if (!err) {
                if (rows.length > 0) {
                    var info = rows[0];

                    res.status(200).json(info);
                } else {
                    res.status(400).json({ message: "Something went wrong!" });
                }
            } else {
                console.log(err);
                res.status(400).json({ message: "Something went wrong!" });
            }
        });
    } catch (e) {
        res.status(400).json({ message: "Something went wrong!", _error: e });
    }
};