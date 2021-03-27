import StylishRDB from '../../db/index'

class ChatRoomService {
	async getChatRoomsListById(userId: string) {
		try {
			return await StylishRDB.messagesModule.getChatRoomsListById({
				adminId: userId,
			})
		} catch (error) {
			throw error
		}
	}

	async getChatRoomHistory(room: string) {
		try {
			return await StylishRDB.messagesModule.getMessagesByRoom(room)
		} catch (error) {
			throw error
		}
	}
	getPinMessages = async (opt: { adminId: string }) => {
		const { adminId } = opt
		return await StylishRDB.pinMessagesModule.getPinMessagesByAdminId({
			adminId,
		})
	}

	createPinMessage = async (opt: { adminId: string; message: string }) => {
		const { adminId, message } = opt
		console.log('adminId, message-->', adminId, message)
		return await StylishRDB.pinMessagesModule.createPinMessages([
			{ user_id: adminId, message },
		])
	}

	deletePinMessage = async (opt: { adminId: string; message: string }) => {
		const { adminId, message } = opt
		return await StylishRDB.pinMessagesModule.deletePinMessage({
			adminId,
			message,
		})
	}
}

export = new ChatRoomService()
