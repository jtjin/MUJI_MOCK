import { Socket } from 'socket.io'
import MujiRDB from '../../db/index'
import { redisClient } from '../../db/redisDb'
import * as R from 'ramda'
let that: UserHandler

class UserHandler {
	private io: SocketIO.Server
	private currentUsersList: Partial<{
		socketId: string
		userId: string
		room: string
		userName: string
	}>[] = []

	private rooms: { name?: string[] } = {}
	private messagesBucket: any = {}

	constructor(io: SocketIO.Server, socket: Socket) {
		that = this
		this.io = io
		socket.on('userJoinRoom', this.joinUserToChatRoom)
		socket.on('newUserGetOnline', this.refreshRoomListAndGreetUser)
		socket.on('newAdminGetOnline', this.refreshRoomListAndGreetAdmin)
		socket.on('newChatMessage', this.sendChatMessage)
		socket.on('disconnect', this.userLeaveTheRoom)
		socket.on('sendMainPagePopAd', this.sendMainPagePopAd)
	}

	sendMainPagePopAd = async (data: { message: string }) => {
		that.io.emit('popMainPageAD', { ...data })
	}

	async sendChatMessage(
		this: Socket,
		userInfo: {
			userId: string
			message: string
			time: Date
			room: string
			role: string
		},
	) {
		console.log('=userInfo==>', userInfo)

		userInfo.time = new Date(userInfo.time)

		const lockKey = `lock:${userInfo.room}`
		const lock = await redisClient.get(lockKey)
		if (lock) await that._waitUntilRedisRoomUnlock(lockKey)

		await redisClient.set(lockKey, 'true')

		if (userInfo.role === 'admin') {
			that.io.to(userInfo.room).emit('newMessageFromCMS', userInfo)
		} else {
			that.io.to(userInfo.room).emit('renderNewMessage', userInfo)
		}

		const tempHistoryMsg = await redisClient.get(userInfo.room)
		const payload = R.pick(['userId', 'message', 'time'], userInfo)
		if (tempHistoryMsg) {
			const data = Array.from(JSON.parse(String(tempHistoryMsg)))
			data.push(payload)
			await redisClient.set(userInfo.room, JSON.stringify(data))
		} else {
			await redisClient.set(userInfo.room, JSON.stringify([payload]))
		}

		await redisClient.del(lockKey)
	}

	async _waitUntilRedisRoomUnlock(lockKey: string) {
		console.log('_waitUntilRedisRoomUnlock=>', lockKey)
		new Promise((resolve, reject) => {
			setInterval(async () => {
				const lock = await redisClient.get(lockKey)
				if (!lock) return resolve
			}, 1000)
		})
	}

	async userLeaveTheRoom(userInfo: {
		userId: string
		room: string
		userName: string
	}) {
		await that._createOrUpdateUserMessagesDataInRedisAndDB(userInfo)
	}

	_createOrUpdateUserMessagesDataInRedisAndDB = async (userInfo: {
		userId: string
		room: string
		isFirstTime?: boolean
	}) => {
		const data = await redisClient.get(userInfo.room)
		if (!data && !userInfo.isFirstTime) return

		this.createOrUpdateChatRoom({ redisData: data, ...userInfo })
		await redisClient.del(userInfo.room)
	}

	async createOrUpdateChatRoom(userInfo: {
		userId: string
		room: string
		redisData?: any
	}) {
		const messagesInfo = await MujiRDB.messagesModule.getMessagesByRoom(
			userInfo.room,
		)

		if (messagesInfo && userInfo.redisData) {
			const updatedMessages = Array.from(
				JSON.parse(String(messagesInfo.messages)),
			).concat(Array.from(JSON.parse(userInfo.redisData)))

			await MujiRDB.messagesModule.updateRoomMessages(
				userInfo.room,
				JSON.stringify(updatedMessages),
			)
		} else if (userInfo.redisData) {
			await MujiRDB.messagesModule.createMessages([
				{
					user_id: userInfo.userId,
					room: userInfo.room,
					messages: userInfo.redisData,
				},
			])
		} else if (!messagesInfo && !userInfo.redisData) {
			await MujiRDB.messagesModule.createMessages([
				{
					user_id: userInfo.userId,
					room: userInfo.room,
				},
			])
		}
	}

	refreshRoomListAndGreetUser = async function (
		this: Socket,
		userInfo: {
			userId: string
			room: string
			userName?: string
		},
	) {
		const socket = this

		const history = await MujiRDB.messagesModule.getMessagesByRoom(
			userInfo.room,
		)

		if (history) {
			that.io.to(userInfo.room || userInfo.userId).emit('getHistory', history)
		} else {
			that.io.to(userInfo.room || userInfo.userId).emit('greetNewUser', {
				message: '👋 Hi there, welcome to muji!',
				time: new Date(),
			})
			if (userInfo.userName === 'randomUser') {
				that.io.to(userInfo.room || userInfo.userId).emit('newMessageFromCMS', {
					message: `Please sign in first, before sending message, or it won't be saved. Thank you.`,
					time: new Date(),
				})
			}
		}

		that.io.emit('updateAdminRoomsList')
	}

	joinUserToChatRoom = async function (
		this: Socket,
		userInfo: {
			userId: string
			room: string
			userName?: string
		},
	) {
		await that._createOrUpdateUserMessagesDataInRedisAndDB({
			isFirstTime: true,
			...userInfo,
		})
		this.join(userInfo.room || userInfo.userId)
	}

	refreshRoomListAndGreetAdmin(
		this: Socket,
		userInfo: {
			userId: string
			room: string
			username: string
		},
	) {
		that.io.to(this.id).emit('greetNewAdmin', {
			userName: 'System',
			message:
				'Hi there, welcome to muji. ' +
				`\n` +
				' 👈 To begin chat, please click on the room from right side.',
			time: new Date(),
		})
	}

	getCurrentUsersList() {
		return this.currentUsersList
	}

	getCurrentUserBySocketId(socketId: string) {
		return this.currentUsersList.find((user) => user.socketId == socketId)
	}

	deleteUserFromChatRoom(socketId: string) {
		const index = this.currentUsersList.findIndex(
			(user) => user.socketId === socketId,
		)
		if (index !== -1) {
			return this.currentUsersList.splice(index, 1)[0]
		}
	}

	getRoomUsers(room: string) {
		return this.currentUsersList.filter((user) => user.room === room)
	}
}

export = UserHandler
