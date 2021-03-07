"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = __importDefault(require("../controller/product"));
const express_1 = require("express");
const router = express_1.Router();
router.post('/admin/product', product_1.default.uploadImg, product_1.default.createdPhotos);
router.get('/products/:bodyTag', product_1.default.getProductCache, product_1.default.getProductsListByTag);
module.exports = router;
/* ----------------------------------------
--- GET ORDERS // 期中考增加的
------------------------------------------*/
// router.get('/order/payments', cacheOrder, (req, res) => {
// 	let sql =
// 		'SELECT user_id, SUM(total) AS total_payment FROM orders GROUP BY user_id'
// 	pool.query(sql, function (err, result) {
// 		if (err) {
// 			console.log(err)
// 		} else {
// 			client.setex('payments', 5000, JSON.stringify(result))
// 			res.send(result)
// 		}
// 	})
// })
// function cacheOrder(req, res, next) {
// 	client.get('payments', (err, data) => {
// 		if (err) throw err
// 		if (data != null) {
// 			res.send(data)
// 		} else {
// 			next()
// 		}
// 	})
// }
