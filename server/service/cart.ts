import MujiRDB from '../db/index'
import { CartModule } from '../db/modules/CartModule'

import { Product } from '../db/entities/Product'

import * as R from 'ramda'
import { ProductDetails } from '../db/entities/ProductDetails'
import { EntityManager, getConnection } from 'typeorm'

import { redisClient } from '../db/redisDb'
import { safeAwait } from '../utils/safeAsync'
import { customErrors } from '../infra/customErrors'

import { ErrorType } from '../infra/enums/errorType'
import { ErrorHandler } from '../middleWares/errorHandler'

const tag = 'server/service/cart'

class CartService {
	tag: string
	constructor() {
		this.tag = 'CartService'
	}

	async getItemsByUserId(userId: string) {
		try {
			return await MujiRDB.cartModule.getCartItemsByUserId(userId)
		} catch (error) {
			throw error
		}
	}

	async createItems(opt: {
		productId: string
		variantId: string
		quantity: number
		userId: string
	}) {
		const {
			productId: product_id,
			variantId: variant_id,
			quantity,
			userId: user_id,
		} = opt

		await MujiRDB.cartModule.insertCartItem([
			{ user_id, quantity, variant_id, product_id },
		])
	}

	async deleteItemById(userId: string) {}
}

export = new CartService()
