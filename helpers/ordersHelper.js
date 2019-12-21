const database = require('../database/connection');

//get total cash of an order 
exports.order_get_total = function (order_id) {
    return new Promise((resolve, reject) => {
        let result = {
            id: order_id,
            books: [{
                name: null,
                amount: null,
                price: null,
                discount: null,
            }],
            total: 0
        }
        this.detail_get_book_info(result)
            .then(result => {
                result.books.forEach(book => {
                    result.total += (book.price - (book.discount * book.price / 100)) * book.amount;
                })
                resolve(result.total);
            })
            .catch(err => {
                return reject(err);
            })
    })
}


//detail services
exports.detail_get_order_info = function (result, id) {
    return new Promise((resolve, reject) => {
        database.query(`SELECT * FROM orders WHERE id = ?;`,
            [parseInt(id)], (err, rows, fields) => {
                if (!err) {
                    if (rows.length > 0){
                        result.orderDate = rows[0].created_date;
                        result.shipDate = rows[0].ended_date;
                        result.status = rows[0].status;
                        result.id = rows[0].id;
                        result.address.id = rows[0].address_id;
                        result.user.id = rows[0].user_id;
                        resolve(result);
                    } else {
                        result = {};
                        resolve(result);
                    }
                } else {
                    return reject(err);
                }
            })
    })
}

//detail services
exports.detail_get_address_info = function (result) {
    return new Promise((resolve, reject) => {
        database.query(`SELECT * FROM addresses WHERE id = ?;`,
            [parseInt(result.address.id)], (err, rows, fields) => {
                if (!err) {
                    if (rows.length > 0) {
                        result.address.useraddress = rows[0].address;
                        result.address.province = rows[0].province;
                        result.address.district = rows[0].district;
                        result.address.ward = rows[0].ward;
                        resolve(result);
                    }  else {
                        result = {};
                        resolve(result);
                    }
                    
                } else {
                    return reject(err);
                }
            })
    })
}

//detail services
exports.detail_get_user_info = function (result) {
    return new Promise((resolve, reject) => {
        database.query(`SELECT * FROM users WHERE id = ?;`,
            [parseInt(result.user.id)], (err, rows, fields) => {
                if (!err) {
                    if (rows.length > 0) {
                        result.user.name = rows[0].fullname;
                        result.user.phone = rows[0].phone;
                        resolve(result);
                    } else {
                        result = {};
                        resolve(result);
                    }
                    
                } else {
                    return reject(err);
                }
            })
    })
}

//detail services
exports.detail_get_book_info = function (result) {
    return new Promise((resolve, reject) => {
        database.query(`SELECT od.amount, b.price, b.name, b.discount 
                        FROM orderdetails od LEFT JOIN books b 
                        ON od.book_id = b.id 
                        WHERE od.order_id = ?;`,
            [result.id], (err, rows, fields) => {
                if (!err) {
                    result.books = rows;
                    resolve(result);
                } else {
                    return reject(err);
                }
            })
    })
}
