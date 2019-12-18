const database = require('../database/connection');
const cartsController = require('./cartsController');
const ordersHelper = require('../helpers/ordersHelper');

//list
exports.list = (req, res) => {
    /*
        How to gọi hàm cho que que
        ordersHelper.order_get_total(truyền order id vào đây))
            .then(resutlt => {
                result là tổng tiền tính đc, chỉ có hiệu lực trong hàm này thôi ra ngoài là undefined đấy :v
                xử  lý trong này thôi nha
            })
            .catch(e => {
                res.status(202).json({message: "Không thực hiện được yêu cầu"});
            });

    */
  
    // phần cũ của m đang làm dở đây
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
    try {
        /*"id": 0,
        "fullName": "string",
        "phone": "string",
        "createDate": "2019-12-18T15:22:10.754Z",
        "shipDate": "2019-12-18T15:22:10.754Z",
        "status": 1*/

        database.query(`SELECT o.id, u.fullname, u.phone, o.created_date, o.ended_date, o.status 
                        FROM orders o, users u 
                        WHERE o.user_id = u.id;
                        SELECT od.order_id, od.amount, b.price, b.name, b.discount 
                        FROM orderdetails od LEFT JOIN books b 
                        ON od.book_id = b.id;
                        `, (err, rows, fields) => {
            if (rows.length > 0) {
                let body = req.body;

                let orders = [];
                
                let getTotal = (id) => {
                    total = rows[1].filter(row => {
                        return row.order_id === id;
                    }).reduce(function(acc, object) {
                        return  acc + (object.price - ((object.discount*object.price)/100))*object.amount;}, 0)
                    return total;
                }

                //infomation
                rows[0].map(row => {
                    orders.push({
                        id: row.id,
                        fullName: row.fullname,
                        phone: row.phone,
                        createDate: row.created_date,
                        shipDate: row.ended_date,
                        status: row.status,
                        total: getTotal(row.id)
                    })
                })
            
                if (body.id !== ""){
                    orders = orders.filter((order) => {
                        return order.id === body.id;
                    })
                }
                if (body.fullName !== ""){
                    orders = orders.filter((order) => {
                        return order.fullName.includes(body.fullName);
                    })
                }
                if (body.phone !== ""){
                    orders = orders.filter((order) => {
                        return order.phone.includes(body.phone);
                    })
                }
                if (body.createDate !== ""){
                    orders = orders.filter((order) => {
                        return order.createDate === body.createDate;
                    })
                }
                if (body.shipDate !== ""){
                    orders = orders.filter((order) => {
                        return order.shipDate === body.shipDate;
                    })
                }
                if (body.status !== ""){
                    orders = orders.filter((order) => {
                        return order.status === body.status;
                    })
                }

                res.status(200).json(orders);
            } else {
                res.status(200).json([])
            }
        })
    } catch (e){
        res.status(500).json({message: "Đã có lỗi xảy ra", _error: e})
    }
    ordersHelper.order_get_total(10)
        .then(result => {ans = result})
        .catch(e => console.log(e));
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

    ordersHelper.detail_get_order_info(order, body.id)
        .then(result => ordersHelper.detail_get_address_info(result))
        .then(result => ordersHelper.detail_get_user_info(result))
        .then(result => ordersHelper.detail_get_book_info(result))
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
    let params = [parseInt(user_id), body.orderDate, parseInt(body.status), parseInt(body.address_id)];
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
