const database = require('../database/connection');

exports.get_user_address = (req, res) => {
    try {
        let user_id = req.headers.id;
        database.query(`SELECT id, address AS street, province, district, ward FROM addresses WHERE user_id = ?`,
            [user_id], (err, rows, field) => {

                if (!err) {
                    if (rows.length > 0) {
                        let userAddress = rows;
                        res.status(200).json(userAddress);
                    } else
                        if (rows.length === 0) {
                            res.status(200).json([]);
                        }
                } else {
                    res.status(202).json({ message: "Không thực hiện được yêu cầù" });
                }
            })
    } catch (e) {
        res.status(500).json({ message: "Đã có lỗi xảy ra", _error: e });
    }
}

exports.new = (req, res) => {
    try {
        let user_id = req.headers.id;
        let body = req.body;
        let params = [body.street, user_id, parseInt(body.province), parseInt(body.district), parseInt(body.ward)];
        database.query(`INSERT INTO addresses (address, user_id, province, district, ward) VALUES (?, ?, ?, ?, ?);
                        SELECT id, address AS street, province, district, ward FROM addresses WHERE id=(SELECT LAST_INSERT_ID() FROM addresses LIMIT 1);`,
            params, (err, rows, field) => {
                if (!err) {
                    let addedInfo = rows[1];
                    res.status(201).json({ data: addedInfo, message: "Thêm địa chỉ mới thành công" });
                } else {
                    res.status(202).json({ message: "Không thực hiện được yêu cầu" });
                }
            })
    } catch (e) {
        res.status(500).json({ message: "Đã có lỗi xảy ra", _error: e });
    }
}

exports.update = (req, res) => {
    try {
        let body = req.body;
        let params = [body.street, parseInt(body.province), parseInt(body.district), parseInt(body.ward), body.address_id, body.address_id];

        database.query(`UPDATE addresses SET address = ?, province = ?, district = ?, ward = ? WHERE id = ?;
                        SELECT id, address AS street, province, district, ward FROM addresses WHERE id = ?`,
            params, (err, rows, field) => {
                if (!err) {
                    let updatedInfo = rows[1];
                    res.status(200).json({ data: updatedInfo, message: "Cập nhật thành công" });
                } else {
                    res.status(202).json({ message: "Không thực hiện được yêu cầu" });
                }
            })
    } catch (e) {
        res.status(500).json({ message: "Đã có lỗi xảy ra", _error: e });
    }
}

exports.delete = (req, res) => {
    try {
        let address_id = req.body.address_id;
        database.query(`DELETE FROM addresses WHERE id = ?`, [address_id], (err, rows, field) => {
            if (!err) {
                res.status(200).json({ address_id, message: "Xóa thành công" });
            } else {
                res.status(202).json({ message: "Không thực hiện được yêu cầu" });
            }
        })
    } catch (e) {
        res.status(500).json({ message: "Đã có lỗi xảy ra", _error: e });
    }
}
