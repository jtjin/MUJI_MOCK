import CharRoomController from '../controller/chatRoom'

import { Router } from 'express'
const router = Router()

router.get(
	'/admin/chatRoomList/:userId',
	CharRoomController.getChatRoomsListById,
)

router.get('/chatRoom/history/:room', CharRoomController.getChatRoomHistory)

router.get('/admin/chatRoom/pin/:adminId', CharRoomController.getPinMessages)

router.post('/admin/chatRoom/pin/:adminId', CharRoomController.createPinMessage)

router.delete(
	'/admin/chatRoom/pin/:adminId',
	CharRoomController.deletePinMessage,
)

module.exports = router
