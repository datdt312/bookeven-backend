const database = require('../database/connection');

exports.list = (req, res) => {
    try {
        database.query(`SELECT name FROM bookfields`, (err, rows, field) => {
            if (!err){
                if (rows.length > 0){
                    let bookfieldList = rows;
                    res.status(200).json(bookfieldList);
                } else {
                    res.status(400).json({message: "Can't find any result"})
                }
            } else {
                res.status(400).json({message: err});
            }
        })

    } catch(e){
        res.status(400).json({message: "Something went not so right :(", _error: e})
    }
}

