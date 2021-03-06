const database = require('../database/connection');

exports.list = (req, res) => {
    try {
        database.query(`SELECT * FROM bookfields`, (err, rows, field) => {
            if (!err){
                if (rows.length > 0){
                    let bookfieldList = rows;
                    res.status(200).json(bookfieldList);
                } else if (rows.length === 0) {
                    res.status(200).json([])
                }
            } else {
                res.status(202).json({message: "Không thực hiện được yêu cầu"});
            }
        })

    } catch(e){
        res.status(500).json({message: "Đã có lỗi xảy ra", _error: e})
    }
}

