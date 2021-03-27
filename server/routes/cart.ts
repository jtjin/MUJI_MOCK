import Product from '../controller/product'
import config from 'config'
import { redisClient } from '../db/redisDb'
import fs from 'fs'
import path from 'path'
import { Router } from 'express'
const router = Router()

// TODO: Add cart function
// router.use(authorization)
// router.post('/cart/', Product.uploadImg, Product.createProduct)
// router.get('/cart', Product.getProductsListByTag)
// router.delete('/cart', Product.getProductsListByTag)

module.exports = router
