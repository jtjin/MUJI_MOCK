import MujiRDB from '../../db/index'

class ChatRoomService {
	async getChatRoomsListById(userId: string) {
		try {
			return await MujiRDB.messagesModule.getChatRoomsListById({
				adminId: userId,
			})
		} catch (error) {
			throw error
		}
	}

	async getChatRoomHistory(room: string) {
		try {
			return await MujiRDB.messagesModule.getMessagesByRoom(room)
		} catch (error) {
			throw error
		}
	}
	getPinMessages = async (opt: { adminId: string }) => {
		const { adminId } = opt
		return await MujiRDB.pinMessagesModule.getPinMessagesByAdminId({
			adminId,
		})
	}

	createPinMessage = async (opt: { adminId: string; message: string }) => {
		const { adminId, message } = opt
		console.log('adminId, message-->', adminId, message)
		return await MujiRDB.pinMessagesModule.createPinMessages([
			{ user_id: adminId, message },
		])
	}

	deletePinMessage = async (opt: { adminId: string; message: string }) => {
		const { adminId, message } = opt
		return await MujiRDB.pinMessagesModule.deletePinMessage({
			adminId,
			message,
		})
	}
}

export = new ChatRoomService()
