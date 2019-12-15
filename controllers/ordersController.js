const database = require('../database/connection');
const cartsController = require('./cartsController');

//list
exports.list = (req, res) => {

}

//Filter
exports.filter = (req, res) => {

}

//order detail
exports.detail = (req, res) => {
    let body = req.body;
    try {
        database.query(`SELECT * FROM orders WHERE id = ?;
                        SELECT book_id, amount FROM orderdetails WHERE order_id = ?`,
                        [body.id, body.id], (err, rows, fields) => {
            if (!err) {
                res.status(200).json({data: rows[0], books: rows[1]});
            } else {
                res.status(202).json({message: "Không thực hiện được yêu cầu" + err});
            }
        })
    } catch (e) {
        res.status(500).json({message: "Đã có lỗi xảy ra", _error: e});
    }
}

//new nè
exports.add_order = (req, res) => {
    let user_id = req.headers.id;
    let body = req.body;
    let params = [user_id, body.createDate, body.status, body.address_id];
    try {
        //insert into orders
        database.query(`INSERT INTO orders (user_id, created_date, status, address_id) VALUES (?, ?, ?, ?);
                    SELECT LAST_INSERT_ID() AS 'order_id' FROM orders;`,
                    params, (err, rows, fields) => {
            if(!err) {
                //get order id after inserting
                let order_id = rows[1][0].order_id;
                // insert into orderdetail
                database.query(`INSERT INTO orderdetails (book_id, order_id, amount) 
                                SELECT book_id, (SELECT id FROM orders WHERE id = ?), amount 
                                FROM carts WHERE user_id = ?
                                ;`, [order_id, user_id], (err, rows, fields) => {
                    if (!err){
                        res.status(200).json({ order_id: order_id, message: "Tạo đơn hàng thành công" });
                        cartsController.remove_all_book(user_id);
                    } else {
                        res.status(202).json({message: "Không thực hiện được yêu cầu" + err});
                    }
                })
            } else {
                res.status(202).json({message: "Không thực hiện được yêu cầu" + err});
            }
        })
    } catch(e) {
        res.status(500).json({message: "Đã có lỗi xảy ra", _error: e});
    }
    
}

//update
exports.update = (req, res) => {
    
}