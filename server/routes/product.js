"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = __importDefault(require("../controller/product"));
const authorization_1 = require("../middleWares/authorization");
const express_1 = require("express");
const router = express_1.Router();
router.get('/products/details', product_1.default.getProductDetail);
router.get('/products/variant', product_1.default.getProductVariant);
router.get('/products/category', product_1.default.getProductsListByTag);
// TODO: Move this to admin folder
router.post('/admin/product', authorization_1.isAuth, product_1.default.uploadImg, product_1.default.createProduct);
// TODO: Add edit product function
// router.put('/admin/product', Product.uploadImg, Product.createProduct)
// TODO: Add delete product function
// router.delete('/admin/product/:productId', Product.deleteProduct)
module.exports = router;
/* ----------------------------------------
--- GET ORDERS
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
