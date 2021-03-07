import Product from '../controller/product'
import config from 'config'
import { redisClient } from '../db/redisDb'
import fs from 'fs'
import path from 'path'
import { Router } from 'express'
const router = Router()

router.post('/admin/product', Product.uploadImg, Product.createdPhotos)

router.get(
	'/products/:bodyTag',
	Product.getProductCache,
	Product.getProductsListByTag,
)

module.exports = router

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
