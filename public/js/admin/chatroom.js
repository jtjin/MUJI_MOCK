import config from '../infra/config.js'
import { privateApi } from '../infra/apis.js'

class AdminChatroomManager {
	constructor() {
		this.socket = io()
		this.adminInfo = {
			id: 0,
			name: 'admin',
			role: 'admin',
			room: this.room,
		}
		this._initElement()
		this.PinMessageManager = new PinMessageManager({
			socket: this.socket,
			messageInput: this.messageInput,
			messagesContainer: this.messagesContainer,
			adminInfo: this.adminInfo,
		})
		this.MessageSender = new MessageSender({
			socket: this.socket,
			messageInput: this.messageInput,
			messagesContainer: this.messagesContainer,
			adminInfo: this.adminInfo,
		})

		this._socketInit()
		this.nowDate = new Date()
		this.nowHours = this.nowDate.getHours()
		this.nowMinutes = this.nowDate.getMinutes()
		this.nowUserId = ''
		this._getRoomsList()
	}

	_initElement() {
		this.currentUserName = document.getElementById('currentUserName')
		this.roomsContainer = document.getElementById('roomsContainer')
		this.submitBroadcastBtn = document.querySelector('.submitBroadcastBtn')
		this.roomListTemplate = document.querySelector('.roomListTemplate')

		this.messageInput = document.querySelector('.messageInput')
		this.messagesContainer = document.querySelector('.messagesContainer')
	}

	_socketInit() {
		this.socket.emit('heartbeat', 'Admin chat room')
		this.socket.emit('newAdminGetOnline', { userId: this.adminInfo.id })
		this.socket.on('greetNewAdmin', this.MessageSender.appendMessage)
		this.socket.on('renderNewMessage', this.MessageSender.appendMessage)
		this.socket.on('updateAdminRoomsList', this._getRoomsList)
	}

	_getHistoryMessages = async (room) => {
		const { data } = (
			await privateApi.get(config.api.user.chatRoomHistory + `/${this.room}`)
		).data
		const parsedHistory = Array.from(JSON.parse(data.messages))
		parsedHistory.forEach((info) => {
			if (info.userId === this.adminInfo.id) {
				this.MessageSender.appendMessage({
					userId: this.adminInfo.id,
					userName: this.adminInfo.name || 'Admin' + '-' + this.adminInfo.id,
					message: info.message,
					time: info.time,
				})
			} else {
				this.MessageSender.appendMessage({
					userId: info.userId,
					userName: info.userName || 'User' + '-' + info.userId,
					message: info.message,
					time: info.time,
				})
			}
		})
	}

	async _getRoomsList() {
		try {
			const { data } = (
				await privateApi.get(config.api.admin.chatRoomList)
			).data

			this.roomsContainer.innerHTML = ''
			data.forEach((item) => {
				const roomListItem = this.roomListTemplate.content.cloneNode(true)
				const roomLink = roomListItem.querySelector('a')
				roomListItem.querySelector('.roomName').innerText =
					'User ' + item.user_id
				const icon = roomListItem.querySelector('.roomIcon')
				roomLink.setAttribute('id', item.room)
				roomLink.addEventListener('click', (e) => {
					e.preventDefault()
					this.enterUserRoom(item.user_id, item.name)
				})
				if (item.adminRead) {
					icon.innerText = '🔵'
				} else {
					icon.innerText = '🟡'
				}
				this.roomsContainer.appendChild(roomListItem)
			})
		} catch (err) {
			console.log(err)
		}
	}

	enterUserRoom = async (userId, name) => {
		this.nowUserId = userId
		this.room = this.nowUserId + '_' + this.adminInfo.id
		this.adminInfo.room = this.room
		this.MessageSender.room = this.room
		console.log('adminInfo-->', this.adminInfo)
		this.socket.emit('disconnect', {
			userId: this.adminInfo.id,
			room: this.room,
			userName: this.adminInfo.name,
		})
		this.socket.disconnect()
		this.messagesContainer.innerHTML = ''
		await this._getHistoryMessages(this.room)
		this.socket.connect()
		this.socket.emit('userJoinRoom', {
			userId: this.adminInfo.id,
			room: this.room,
			userName: this.adminInfo.name,
		})

		this.currentUserName.innerHTML = name || userId

		this._getRoomsList()
	}

	sendMainPagePopAd = () => {
		let message = messageInput.value
		if (!message) return
		this.socket.emit('sendMainPagePopAd', message)
		messageInput.value = ''
		messageInput.focus()
	}
}

class MessageSender {
	constructor({ messageInput, messagesContainer, socket, adminInfo }) {
		this.socket = socket
		this.adminInfo = adminInfo
		this.sendMsgBtn = document.querySelector('.sendMsgBtn')
		this.messageInputForm = document.querySelector('#messageInputForm')
		this.messageInput = messageInput || document.querySelector('.messageInput')
		this.messagesContainer =
			messagesContainer || document.querySelector('.messagesContainer')
		this.userMessageTemplate = document.querySelector('.userMessageTemplate')
		this._initElementEvent()
	}
	_initElementEvent() {
		this.sendMsgBtn.addEventListener('click', (event) => {
			if (event.keyCode == 13 || event.which == 13) this.submitNewMessage()
		})
		this.messageInput.addEventListener('keypress', (event) => {
			if (event.keyCode == 13 || event.which == 13) this.submitNewMessage()
		})
	}

	submitNewMessage = () => {
		if (!this.messageInput.value) return
		console.log(this.adminInfo)

		const payload = {
			userId: this.adminInfo.id,
			userName: this.adminInfo.name,
			message: this.messageInput.value,
			room: this.adminInfo.room,
			time: new Date(),
			role: 'admin',
		}
		console.log(payload)
		this.socket.emit('newChatMessage', payload)
		this.messageInput.focus()
		this.appendMessage(payload)
		this.messageInput.value = ''
	}

	appendMessage = ({ userName, message, time }) => {
		const cloneUserMessageDiv = this.userMessageTemplate.content.cloneNode(true)
		if (userName)
			cloneUserMessageDiv.querySelector('.userName').innerText = userName

		let formattedTime

		if (new Date(time).toDateString() !== new Date().toDateString()) {
			const d = new Date(time).toLocaleString('en-IN', {
				timeZone: 'Asia/Taipei',
			})
			var date = d.split(',')[0]
			var time = d.split(',')[1].slice(0, 5)
			formattedTime = `${date} ${time}`
		} else {
			const d = new Date(time).toLocaleTimeString('en-IN', {
				timeZone: 'Asia/Taipei',
			})
			formattedTime = `${d.slice(0, 5)}`
		}
		cloneUserMessageDiv.querySelector('.timeStamp').innerText = formattedTime
		cloneUserMessageDiv.querySelector('.text').innerText = message
		this.messagesContainer.appendChild(cloneUserMessageDiv)
		this.messagesContainer.lastElementChild.scrollIntoView({
			behavior: 'smooth',
		})
	}
	submitBroadcastMessage() {
		// TODO:
		if (!this.messageInput.value) return
		// let message = messageInput.value
		// if (!message) true
		// this.socket.emit('sendBroadcastMessage', message)
		// messageInput.value = ''
		// messageInput.focus()
		// enterUserRoom('broadcast', 'System')
	}
}

class PinMessageManager {
	constructor({ messageInput, messagesContainer, socket, adminInfo }) {
		this.socket = socket
		this.adminInfo = adminInfo
		this.messageInput = messageInput || document.querySelector('.messageInput')
		this.MessageSender = new MessageSender({
			socket: this.socket,
			messageInput: this.messageInput,
			messagesContainer: this.messagesContainer,
			adminInfo: this.adminInfo,
		})
		this.messagesContainer =
			messagesContainer || document.querySelector('.messagesContainer')
		this.pinMsgBtn = document.querySelector('.pinMsgBtn')
		this.pinMessageTemplate = document.querySelector('.pinMessageTemplate')
		this.canMessagesWrap = document.querySelector('.canMessagesWrap')
		this._initElementEvent()
		this.getCanMessages()
	}

	_initElementEvent() {
		this.pinMsgBtn.addEventListener('click', (event) => {
			this.createNewCanMessage()
		})
	}

	getCanMessages = async () => {
		const { data } = (await privateApi.get(config.api.admin.canMessage)).data
		if (!data || data.length === 0) {
			this.appendPinElement(
				`To create can messages template please click the 'Pin' button`,
			)
		}
		data.forEach((item) => {
			console.log(item.message)
			this.appendPinElement(item.message)
		})
	}

	deletePinElement = async (event) => {
		event.target.parentElement.style.display = 'none'
		const message = event.target.nextElementSibling.innerText
		const { result } = (
			await privateApi({
				url: config.api.admin.canMessage,
				method: 'delete',
				data: { message },
			})
		).data
	}

	async createNewCanMessage() {
		const message = this.messageInput.value
		console.log('createNewCanMessage', message)
		if (!message) return

		this.appendPinElement(message)
		const { result } = (
			await privateApi({
				url: config.api.admin.canMessage,
				method: 'POST',
				data: { message },
			})
		).data
		console.log('result', result)
		this.messageInput.innerText = ''
	}

	appendPinElement(msg) {
		const message = msg || this.messageInput.value
		const cloneUserMessageDiv = this.pinMessageTemplate.content.cloneNode(true)
		const textSpan = cloneUserMessageDiv.querySelector('.canMessage')
		textSpan.innerText = message
		cloneUserMessageDiv
			.querySelector('.deletePinButton')
			.addEventListener('click', this.deletePinElement)
		textSpan.addEventListener('click', this.sendCanMessage)
		this.canMessagesWrap.appendChild(cloneUserMessageDiv)
		this.canMessagesWrap.lastElementChild.scrollIntoView({
			behavior: 'smooth',
		})
		this.messageInput.value = ''
		this.messageInput.focus()
	}

	sendCanMessage() {
		this.MessageSender.submitNewMessage()
	}
}

const adminChatroomManager = new AdminChatroomManager()
