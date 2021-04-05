"use strict";
// const express = require("express");
// const routerCheckout = express.Router();
// const pool = require('../core/pool');
// const axios = require('axios')
// const _ = require('lodash');
// /* ----------------------------------------
// --- Redis Cache 設定
// ------------------------------------------*/
// const redis = require('redis');
// const REDIS_PORT = process.env.PORT || 6379;
// // Set data to Redis
// const client = redis.createClient(REDIS_PORT);
// /* ----------------------------------------
// --- Tap Pay
// ------------------------------------------*/
// routerCheckout.get("/admin/checkout.html", cache, (req, res) => {
//     res.render("checkout");
// });
// /* routerCheckout.get("/admin/total_value", (req, res) => {
//     res.render("checkout");
// });
//  */
// routerCheckout.get("/total_value", cache, async (req, res) => {
//     let sql = "SELECT SUM(total) AS total FROM muji.orders";
//     let ans = await pool.query(sql);
//     res.send(ans[0]);
//     client.setex(`/total_value`, 5000, JSON.stringify(ans[0]))
// });
// routerCheckout.get("/total_color", cache, async (req, res) => {
//     let sql = 'SELECT code, name, count(code) AS times, (SELECT COUNT(*) FROM order_details) AS total ,(count(code) / (SELECT COUNT(*) FROM order_details)*100)AS percent FROM order_details GROUP BY code';
//     let ans = await pool.query(sql);
//     let code = _.map(ans, 'code');
//     let name = _.map(ans, "name");
//     let percent = _.map(ans, "percent");
//     let f = [];
//     f.push(code, name, percent);
//     res.send(f);
//     client.setex(`/total_color`, 5000, JSON.stringify(f))
// });
// routerCheckout.get("/total_price", cache, async (req, res) => {
//     let sql = 'SELECT price,qty FROM muji.order_details';
//     let ans = await pool.query(sql);
//     let price = _.map(ans, 'price');
//     let qty = _.map(ans, "qty");
//     let f = [];
//     f.push(price, qty);
//     res.send(f);
//     client.setex(`/total_price`, 5000, JSON.stringify(f))
// });
// routerCheckout.get("/total_size", cache, async (req, res) => {
//     let sql = 'SELECT id,size, SUM(qty) AS total FROM muji.order_details group by id, size';
//     let ans = await pool.query(sql);
//     let f = _.groupBy(ans, function (ans) { return ans.size; });
//     let ans2 = Object.values(f).map(e => {
//         let f = [];
//         f.push(e[0].size)
//         f.push(_.map(e, "id"))
//         f.push(_.map(e, "total"))
//         return f
//     });
//     res.send(ans2);
//     client.setex(`/total_size`, 5000, JSON.stringify(ans2))
// });
// function cache(req, res, next) {
//     client.get(req.url, (err, data) => {
//         if (err) throw err;
//         if (data != null) {
//             res.send(data);
//         } else {
//             next();
//         }
//     })
// };
// /* ------------------------------------------------------- */
// routerCheckout.post("/admin/checkout", async (req, res) => {
//     let list = JSON.parse(req.body.localStorage.cart).list
//     let total = list.reduce((arr, eve) => {
//         arr += eve.price;
//         return arr;
//     }, 0)
//     let timeInMs = parseInt(Date.now() + '' + Math.floor(Math.random() * 100));
//     let value0 = [
//         [timeInMs, total, 'delivery', '14', 'Loris', 'Appworks', '02-85431355', 'appworks100@hotmail', '新北市新店區好棒路19號900樓', 'anytime']
//     ];
//     let sql0 = 'INSERT INTO orders(order_id,total, shipping, freight, user_id, rec_name, rec_phone, rec_email, rec_address, rec_time ) VALUES ?';
//     pool.query(sql0, [value0], function (err, result) {
//         if (err) {
//             console.log('There is something wrong!');
//         }
//     });
//     await list.forEach(async (order) => {
//         let {
//             id,
//             name,
//             price,
//             main_image,
//             size,
//             color,
//             qty
//         } = order;
//         let colorSQL = `SELECT name FROM product_details WHERE color_code = "${color}"`
//         let color_name = await pool.query(colorSQL);
//         console.log(color_name);
//         let value = [
//             [timeInMs, id, price, size, color, color_name[0].name, qty - 0]
//         ];
//         let sql = 'INSERT INTO order_details(order_id,id,price,size,code,name, qty) VALUES ?';
//         console.log(sql, [value],);
//         pool.query(sql, [value], function (err, result) {
//             console.log(result);
//             if (err) {
//                 console.log(err);
//                 console.log('There is something wrong!');
//             }
//         });
//     })
//     let ans = {
//         prime: `${req.body.primeTPD}`,
//         order: {
//             shipping: "delivery",
//             payment: "credit_card",
//             subtotal: 1234,
//             freight: 14,
//             total: total,
//             recipient: {
//                 name: "Luke",
//                 phone: "0987654321",
//                 email: "luke@gmail.com",
//                 address: "市政府站",
//                 time: "morning"
//             },
//             list: list
//         },
//     };
//     var command = `{
//                 "prime": "${req.body.primeTPD}",
//                 "partner_key": "partner_6ID1DoDlaPrfHw6HBZsULfTYtDmWs0q0ZZGKMBpp4YICWBxgK97eK3RM",
//                 "merchant_id": "GlobalTesting_CTBC",
//                 "details": "Some item",
//                 "amount": "1",
//                 "cardholder": {
//                     "phone_number": "+886923456789",
//                     "name": "王小明",
//                     "email": "LittleMing@Wang.com",
//                     "zip_code": "100",
//                     "address": "台北市天龍區芝麻街1號1樓",
//                     "national_id": "A123456789"
//                     },  "remember": false } `
//     await axios.post('https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime', command, {
//         headers: {
//             'Content-Type': 'application/json',
//             'x-api-key': 'partner_6ID1DoDlaPrfHw6HBZsULfTYtDmWs0q0ZZGKMBpp4YICWBxgK97eK3RM'
//         }
//     }).then((response) => {
//         let sql2 = `UPDATE orders SET payment_state = 'Yes' WHERE order_id = ${timeInMs}`
//         console.log(sql2);
//         if (response.data.status == 0) {
//             pool.query(sql2, function (err, result) {
//                 if (err) {
//                     res.send(err);
//                 }
//                 else {
//                     console.log(result);
//                     // res.json({ "data": { "number": `${timeInMs}` } });
//                     console.log(response.data);
//                     res.redirect('/thankyou.html');
//                 }
//             })
//         };
//         client.del("/total_value", "/total_color", "/total_price", "/total_size");
//     });
// })
// module.exports = routerCheckout;
