import { StylishRouter } from '../infra/interfaces/express'
import ChatRoomService from '../service/admin/chatRoom'
import { ErrorType } from '../infra/enums/errorType'
import { ErrorHandler } from '../middleWares/errorHandler'

import logger from '../utils/logger'

const tag = 'controller/admin/chatRoom'

class CharRoomController {
	constructor() {}

	getChatRoomsListById: StylishRouter = async (req: any, res, next) => {
		try {
			const userId = req.params.userId
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
			res.send({ result: 'success', data: history })
		} catch (error) {
			logger.error({ tag: tag + '/getChatRoomHistory', error })
			next(error)
		}
	}

	getPinMessages: StylishRouter = async (req: any, res, next) => {
		const adminId = req.params.adminId
		const messages = await ChatRoomService.getPinMessages({
			adminId,
		})
		res.send({ result: 'success', data: messages })
	}

	createPinMessage: StylishRouter = async (req: any, res, next) => {
		const adminId = req.params.adminId
		const { message } = req.body
		const data = await ChatRoomService.createPinMessage({
			adminId,
			message,
		})
	}

	deletePinMessage: StylishRouter = async (req: any, res, next) => {
		const adminId = req.params.adminId
		const { message } = req.body
		const data = await ChatRoomService.deletePinMessage({
			adminId,
			message,
		})
	}
}

export = new CharRoomController()
