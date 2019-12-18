const database = require('../database/connection');
const cartsController = require('./cartsController');

//list
exports.list = (req, res) => {
	/*try {
		let order_id = req.body.order_id;
        let books[] = req.body.books;
        let orderDate = req.body.orderDate;
        let shipDate = req.body.shipDate;
        let status = req.body.status;
        let user_id = req.headers.id;
		database.query(`SELECT id, `, (err, rows, fields) => {
			if(!err) {
				if (rows.length > 0){
                    let orderList = rows;
                    //res.status(200).json(orderList);
                    console.log(rows);
                } else {
                    res.status(202).json({message: "Không thực hiện được yêu cầu"})
                }
            } else {
                res.status(202).json({message: "Không thực hiện được yêu cầu"});
            }
		});
	} catch(e){
        res.status(500).json({message: "Đã có lỗi xảy ra", _error: e})
    }*/
}

//Filter
exports.filter = (req, res) => {

}


function detail_get_order_info(result, id) {
    return new Promise((resolve, reject) => {
        database.query(`SELECT * FROM orders WHERE id = ?;`,
                        [id], (err, rows, fields) => {
                if (!err) {
                    result.orderDate = rows[0].created_date;
                    result.shipDate = rows[0].ended_date;
                    result.status = rows[0].status;
                    result.id = rows[0].id;
                    result.address.id = rows[0].address_id;
                    result.user.id = rows[0].user_id;
                    resolve(result);
            } else {
                return reject(err);
            }
        })

    })
} 

function detail_get_address_info(result){
    return new Promise((resolve, reject) => {
        database.query(`SELECT * FROM addresses WHERE id = ?;`, 
                        [result.address.id], (err, rows, fields) => {
            if (!err){
                result.address.useraddress = rows[0].address;
                result.address.province = rows[0].province;
                result.address.district = rows[0].district;
                result.address.ward = rows[0].ward;
                resolve(result);
            } else {
                return reject(err);
            }
        })                 
    })
}

function detail_get_user_info(result){
    return new Promise((resolve, reject) => {
        database.query(`SELECT * FROM users WHERE id = ?;`, 
                        [result.user.id], (err, rows, fields) => {
            if (!err){
                result.user.name = rows[0].fullname;
                result.user.phone = rows[0].phone;
                resolve(result);
            } else {
                return reject(err);
            }                 
        })
    })
}

function detail_get_book_info(result){
    return new Promise((resolve, reject) => {
        database.query(`SELECT od.amount, b.price, b.name, b.discount 
                        FROM orderdetails od LEFT JOIN books b 
                        ON od.book_id = b.id 
                        WHERE od.order_id = ?;`, 
                        [result.id], (err, rows, fields) => {
            if (!err){
                result.books = rows;
                resolve(result);
            } else {
                return reject(err);
            }                 
        })
    })
}

//order detail
exports.detail = (req, res) => {
    var order = {
        id: null,
        orderDate: null,
        shipDate: null,
        status: null,
        user: {
            id: null, 
            name: null,
            phone: null,
        },
        books: [{
            name: null,
            amount: null,
            price: null,
            discount: null,
        }],
        address: {
            id: null,
            useraddress: null,
            province: null,
            district: null,
            ward: null,
        }
    }

    let body = req.body;

    detail_get_order_info(order, body.id)
        .then(result => detail_get_address_info(result))
        .then(result => detail_get_user_info(result))
        .then(result => detail_get_book_info(result))
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(202).json({message: "Không thực hiện được yêu cầu"});
        });
}

//new nè
exports.add_order = (req, res) => {
    let user_id = req.headers.id;
    let body = req.body;
    let params = [parseInt(user_id), body.createDate, parseInt(body.status), parseInt(body.address_id)];
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
                                ;`, [parseInt(order_id), parseInt(user_id)], (err, rows, fields) => {
                    if (!err){
                        res.status(201).json({ message: "Tạo đơn hàng thành công" });
                        cartsController.remove_all_book(user_id);
                    } else {
                        res.status(202).json({message: "Không thực hiện được yêu cầu"});
                    }
                })
            } else {
                res.status(202).json({message: "Không thực hiện được yêu cầu"});
            }
        })
    } catch(e) {
        res.status(500).json({message: "Đã có lỗi xảy ra", _error: e});
    }
    
}

//update
exports.update = (req, res) => {
    let body = req.body;
    let params = [body.shipDate, parseInt(body.status), body.id]
    try {
        database.query(`UPDATE orders SET ended_date = ?, status = ? WHERE id = ?`, 
                        params, (err, rows, fields) => {
            if (!err){
                res.status(200).json({message: "Cập nhật thành công"})
            }
            else {
                res.status(202).json({message: "Không thực hiện được yêu cầu"});
            }
        })
    } catch (e){
        res.status(500).json({message: "Đã có lỗi xảy ra", _error: e});
    }
}
