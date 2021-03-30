import CharRoomController from '../controller/chatRoom'
import { Router } from 'express'
const router = Router()
import { isAuth } from '../middleWares/authorization'

router.get(
	'/admin/chatRoomList/:userId',
	isAuth,
	CharRoomController.getChatRoomsListById,
)

router.get(
	'/chatRoom/history/:room',
	isAuth,
	CharRoomController.getChatRoomHistory,
)

router.get(
	'/admin/chatRoom/pin/:adminId',
	isAuth,
	CharRoomController.getPinMessages,
)

router.post(
	'/admin/chatRoom/pin/:adminId',
	isAuth,
	CharRoomController.createPinMessage,
)

router.delete(
	'/admin/chatRoom/pin/:adminId',
	isAuth,
	CharRoomController.deletePinMessage,
)

module.exports = router
