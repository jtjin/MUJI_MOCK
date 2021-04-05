import Product from '../controller/product'
import { isAuth } from '../middleWares/authorization'
import config from 'config'
import { redisClient } from '../db/redisDb'
import fs from 'fs'
import path from 'path'
import { Router } from 'express'
const router = Router()

router.get('/products/details', Product.getProductDetail)
router.get('/products/variant', Product.getProductVariant)
router.get('/products/', Product.getProductsListByTag)

// TODO: Move this to admin folder
router.post('/admin/product', Product.uploadImg, Product.createProduct)

// TODO: Add edit product function
// router.put('/admin/product', Product.uploadImg, Product.createProduct)

// TODO: Add delete product function
// router.delete('/admin/product/:productId', Product.deleteProduct)

module.exports = router

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
