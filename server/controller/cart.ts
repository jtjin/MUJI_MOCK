import { MujiRouter } from '../infra/interfaces/express'
import CartService from '../service/cart'
import { ErrorType } from '../infra/enums/errorType'
import { ErrorHandler } from '../middleWares/errorHandler'

import logger from '../utils/logger'

const tag = 'controller/admin/chatRoom'

class CartController {
	constructor() {}
	getItemsByUserId: MujiRouter = async (req, res, next) => {
		try {
			const userId = req.me!.id
			const cartList = await CartService.getItemsByUserId(userId)
			res.send({ result: 'success', data: cartList })
		} catch (error) {
			logger.error({ tag: tag + '/getItemsByUserId', error })
			next(error)
		}
	}
	createItemByUserId: MujiRouter = async (req, res, next) => {
		try {
			const { productId, variantId, quantity } = req.body
			if (!productId || !variantId || !quantity || !req.me)
				throw new ErrorHandler(500, ErrorType.ClientError, 'Invalid Data')
			await CartService.createItems({
				productId,
				variantId,
				quantity: Number(quantity),
				userId: req.me.id,
			})

			res.send({ result: 'success' })
		} catch (error) {
			logger.error({ tag: tag + '/createItemByUserId', error })
			next(error)
		}
	}

	deleteItemById: MujiRouter = async (req, res, next) => {
		try {
			// console.log('deleteItemById-->')
			// res.send({ result: 'success', data })
		} catch (error) {
			logger.error({ tag: tag + '/deleteItemById', error })
			next(error)
		}
	}
}

export = new CartController()
