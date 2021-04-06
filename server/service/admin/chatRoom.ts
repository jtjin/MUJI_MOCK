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
		try {
			const { adminId } = opt
			return await MujiRDB.pinMessagesModule.getPinMessagesByAdminId({
				adminId,
			})
		} catch (error) {
			throw error
		}
	}

	createPinMessage = async (opt: { adminId: string; message: string }) => {
		try {
			const { adminId, message } = opt
			return await MujiRDB.pinMessagesModule.createPinMessages([
				{ user_id: adminId, message },
			])
		} catch (error) {
			throw error
		}
	}

	deletePinMessage = async (opt: { adminId: string; message: string }) => {
		try {
			const { adminId, message } = opt
			return await MujiRDB.pinMessagesModule.deletePinMessage({
				adminId,
				message,
			})
		} catch (error) {
			throw error
		}
	}
}

export = new ChatRoomService()
