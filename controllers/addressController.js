const database = require('../database/connection');

exports.get_user_address = (req, res) => {
    try {
        let body = req.query;
        console.log([body.customerId]);
        database.query(`SELECT address, province, district, ward FROM addresses WHERE user_id = ?`, [body.customerId], (err, rows, field) => {
            if (!err){
                if (rows.length > 0) {
                    let userAddress = rows;
                    res.status(200).json(userAddress);
                }   else {
                    res.status(400).json({message: "Can't find any result"});
                }
            } else {
                res.status(400).json({message: err});
            }
        })
    } catch(e){
        res.status(400).json({message: "Something went not so right :(", _error: e});
    }
}

exports.new = (req, res) => {
    try {
        let body = req.body;
        let params = [body.street, body.customerId, body.province, body.district, body.ward];
        database.query(`INSERT INTO addresses (address, user_id, province, district, ward) VALUES (?, ?, ?, ?, ?)`, params, (err, rows, field) =>{
            if (!err) {
                res.status(200).json({message: "New address saved"});
            } else {
                res.status(400).json({message: err});
            }
        })
    } catch (e){
        res.status(400).json({message: "Something went not so right :(", _error: e});
    }
}

exports.update = (req, res) => {
    try {
        let itemId = req.query.addressId;
        let body = req.body;
        let params = [body.street, body.customerId, body.province, body.district, body.ward, itemId];
        database.query(`UPDATE addresses SET address = ?, user_id = ?, province = ?, district = ?, ward = ? WHERE id = ?`, params, (err, rows, field) =>{
            if (!err) {
                res.status(200).json({message: "New address updated"});
            } else {
                res.status(400).json({message: err});
            }
        })
    } catch (e){
        res.status(400).json({message: "Something went not so right :(", _error: e});
    }
}

exports.delete = (req, res) => {
    try {
        let itemId = req.query.addressId;
        database.query(`DELETE FROM addresses WHERE id = ?`, itemId, (err, rows, field) =>{
            if (!err) {
                res.status(200).json({message: "Address deleted"});
            } else {
                res.status(400).json({message: err});
            }
        })
    } catch (e){
        res.status(400).json({message: "Something went not so right :(", _error: e});
    }
}