import MujiRDB from '../db/index'

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
		try {
			const {
				productId: product_id,
				variantId: variant_id,
				quantity,
				userId: user_id,
			} = opt

			await MujiRDB.cartModule.insertOrUpdateCartItem({
				user_id,
				quantity,
				variant_id,
				product_id,
			})
		} catch (error) {
			throw error
		}
	}

	async deleteItemById(opt: {
		userId: string
		variantId: string
		productId: string
	}) {
		try {
			const { userId, variantId, productId } = opt
			const data = await MujiRDB.cartModule.deleteItemById({
				variantId,
				userId,
				productId,
			})
			console.log(data)
		} catch (error) {
			throw error
		}
	}

	async updateItemQuantityById(opt: {
		userId: string
		variantId: string
		productId: string
		quantity: number
	}) {
		try {
			const { userId, variantId, productId, quantity } = opt
			const data = await MujiRDB.cartModule.updateItemQuantityById({
				variantId,
				userId,
				productId,
				quantity,
			})
		} catch (error) {
			throw error
		}
	}
}

export = new CartService()
