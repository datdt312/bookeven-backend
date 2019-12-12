const database = require('../database/connection');

exports.get_user_address = (req, res) => {
    let body = req.body;
    try {
        database.query(`SELECT address, province, district, ward FROM addresses WHERE user_id = ?`, [body.customerId], (err, rows, field) => {
            if (!err){
                if (rows.length > 0) {
                    let userAddress = rows;
                    res.status(200).json(userAddress);
                }   else {
                    res.status(400).json({message: "Can't find any result"});
                }
            } else {
                res.status(400).json({message: "Can't query to the database, sorry huhu"});
            }
        })
    } catch(e){
        res.status(400).json({message: "Something went not so right :(", _error: e})
    }
}