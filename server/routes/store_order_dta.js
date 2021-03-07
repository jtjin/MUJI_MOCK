// require('dotenv').config()
// const express = require('express')
// const min = express.Router()
// const axios = require('axios')
// const _ = require('lodash')

// /* ----------------------------------------
// --- Tap Pay
// ------------------------------------------*/

// min.get('/mid', (req, res) => {
// 	axios
// 		.get('http://arthurstylish.com:1234/api/1.0/order/data')
// 		.then((response) => {
// 			response.data
// 				.forEach(async function (element, index) {
// 					let sql0 = 'INSERT INTO orders(order_id,total) VALUES ?'
// 					let value = [[index, response.data[index].total]]
// 					await pool.query(sql0, [value])
// 					let ans = response.data[index].list.map((r) => {
// 						let arr = Object.values(r)
// 						arr[2] = Object.values(arr[2])
// 						arr.push(index)
// 						return arr.flat()
// 					})
// 					let sql1 =
// 						'INSERT INTO order_details(id,price,code,name,size,qty,order_id) VALUES ?'
// 					await pool.query(sql1, [ans])
// 				})
// 				.catch((err) => {
// 					console.log(err)
// 				})
// 		})
// 		.catch((err) => {
// 			console.log(err)
// 		})
// 	res.send('Ya!')
// })

// module.exports = min
