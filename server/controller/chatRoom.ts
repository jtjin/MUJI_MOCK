import { StylishRouter } from '../infra/interfaces/express'
import ChatRoomService from '../service/admin/chatRoom'
import { ErrorType } from '../infra/enums/errorType'
import { ErrorHandler } from '../utils/middleWares/errorHandler'

import logger from '../utils/logger'

const tag = 'controller/admin/chatRoom'

class CharRoomController {
	constructor() {}

	getChatRoomsListById: StylishRouter = async (req: any, res, next) => {
		try {
			const userId = req.params.userId
			console.log(userId)

			const roomList = await ChatRoomService.getChatRoomsListById(userId)
			console.log(roomList)

			res.send({ result: 'success', data: roomList })
		} catch (error) {
			logger.error({ tag: tag + '/getChatRoomsListById', error })
			next(error)
		}
	}

	getChatRoomHistory: StylishRouter = async (req: any, res, next) => {
		try {
			const room = req.params.room
			const history = await ChatRoomService.getChatRoomHistory(room)
			console.log('getChatRoomHistory=>', history)

			res.send({ result: 'success', data: history })
		} catch (error) {
			logger.error({ tag: tag + '/getChatRoomHistory', error })
			next(error)
		}
	}

	getPinMessages: StylishRouter = async (req: any, res, next) => {
		const adminId = req.params.adminId
		console.log('req.body->', req.body, adminId)
		const messages = await ChatRoomService.getPinMessages({
			adminId,
		})
		console.log('messages=>', messages)
		res.send({ result: 'success', data: messages })
	}

	createPinMessage: StylishRouter = async (req: any, res, next) => {
		const adminId = req.params.adminId
		const { message } = req.body
		console.log('req.body->', req.body)
		const data = await ChatRoomService.createPinMessage({
			adminId,
			message,
		})
		console.log(' createPinMessage messages=>', data)
	}

	deletePinMessage: StylishRouter = async (req: any, res, next) => {
		const adminId = req.params.adminId
		const { message } = req.body
		console.log('req.body->', req.body, adminId)
		const data = await ChatRoomService.deletePinMessage({
			adminId,
			message,
		})
		console.log('deletePinMessage messages=>', data)
	}
}

export = new CharRoomController()
