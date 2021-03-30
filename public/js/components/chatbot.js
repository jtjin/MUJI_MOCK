import config from '../infra/config.js'
import { privateApi, publicApi } from '../infra/apis.js'

class Chatbot extends HTMLElement {
	constructor() {
		super()
		this.userInfo = JSON.parse(localStorage.getItem('stylish')) || {
			id: Math.floor(Math.random() * 1000),
			name: 'randomUser',
		}
		this.shadow = this.attachShadow({ mode: 'open' })
		this.socket = io()
		this.adminId = 0
		this.room
	}

	connectedCallback() {
		this._initTemplate()
		this.render()
		this._initElements()
		this.socketInit()
	}

	_initTemplate() {
		this.loadingCSS = `<link
			rel="stylesheet"
			type="text/css"
			href="./css/components/chatbot.css"	/>`

		this.chatTitleDiv = `	<div class="chatTitle">
				<div class="chatNavLeftPart">
					<div class="avatar">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							class="bi bi-headset"
							viewBox="0 0 16 16"
						>
							<path
								d="M8 1a5 5 0 0 0-5 5v1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a6 6 0 1 1 12 0v6a2.5 2.5 0 0 1-2.5 2.5H9.366a1 1 0 0 1-.866.5h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 .866.5H11.5A1.5 1.5 0 0 0 13 12h-1a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h1V6a5 5 0 0 0-5-5z"
							/>
						</svg>
					</div>
					<h1>Stylish</h1>
					<h2>Customer service</h2>
				</div>
				<div class="chatNavRightPart">
					<button class="closeChatButton">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							class="bi bi-dash-circle"
							viewBox="0 0 16 16"
						>
							<path
								d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
							/>
							<path
								d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"
							/>
						</svg>
					</button>
					
				</div>
			</div>`

		this.messageFromUserTemplate = `<template>
						<div class="message messageFromUserClass">
							<span class="messageText"></span>
							<span class="timestamp"></span>
						</div>
					</template>`

		this.messageFromCmsTemplate = `<template>
						<div class="message messageFromCmsClass">
							<figure class="messageAvatar">
								<svg 
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="currentColor"
									class="bi bi-emoji-smile"
									viewBox="0 0 16 16"
								>
									<path
										d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
									/>
									<path
										d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z"
									/>
								</svg>
							</figure>
							<span class="messageText">
								<div class="loadingBouncingBall"></div>
								<div class="loadingBouncingBall"></div>
								<div class="loadingBouncingBall"></div>
							</span>
							<span class="timestamp"></span>
						</div>
					</template>`

		this.messageBoxDiv = `<div class="messageBox">
				<input
					type="text"
					class="messageInput"
					placeholder="Type message..."
				></input>
				<button type="submit" class="messageSubmit">send</button>
			</div>`

		this.showChatWindowBtn =
			`<div class="chatBoxOuterMessageBox float"><span class="chatBoxOuterMessage">嗨，有任何問題請告訴我們</span></div>` +
			`<div class="showChatWindowBtn newMessageBounce float">
			<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							class="bi bi-headset"
							viewBox="0 0 16 16"
						>
							<path
								d="M8 1a5 5 0 0 0-5 5v1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a6 6 0 1 1 12 0v6a2.5 2.5 0 0 1-2.5 2.5H9.366a1 1 0 0 1-.866.5h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 .866.5H11.5A1.5 1.5 0 0 0 13 12h-1a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h1V6a5 5 0 0 0-5-5z"
							/>
						</svg>
         </div>
		`
	}

	render() {
		this.shadow.innerHTML =
			`<script  src="/socket.io/socket.io.js"></script>` +
			this.loadingCSS +
			this.showChatWindowBtn +
			`<div class="chatbotContainer">` +
			this.chatTitleDiv +
			`<div class="messagesContainer">` +
			`<div class="messagesWrap">` +
			this.messageFromCmsTemplate +
			this.messageFromUserTemplate +
			`</div>` +
			`</div>` +
			this.messageBoxDiv +
			`</div>`
	}

	_initElements() {
		this.chatbotContainer = this.shadow.querySelector('.chatbotContainer')
		this.messageFromCmsDiv = this.shadow.querySelectorAll('template')[0]
		this.messageFromUserDiv = this.shadow.querySelectorAll('template')[1]
		this.messagesWrap = this.shadow.querySelector('.messagesWrap')
		this.closeChatButton = this.shadow.querySelector('.closeChatButton')
		this.showChatWindowBtn = this.shadow.querySelector('.showChatWindowBtn')
		this.messageSubmit = this.shadow.querySelector('.messageSubmit')
		this.messageInput = this.shadow.querySelector('.messageInput')

		this.messageInput.addEventListener('keypress', (event) => {
			if (event.keyCode == 13 || event.which == 13) this.submitNewMessage()
		})

		this.messageSubmit.addEventListener('click', () => {
			this.submitNewMessage()
		})

		this.closeChatButton.addEventListener('click', () => {
			this.closeChatWindow()
		})

		this.showChatWindowBtn.addEventListener('click', () => {
			this.showChatWindow()
		})
	}

	submitNewMessage() {
		if (!this.messageInput.value) return
		this.socket.emit('newChatMessage', {
			userId: this.userInfo.id,
			message: this.messageInput.value,
			room: this.room,
			time: new Date(),
		})
		this.appendMessageFromUser({
			message: this.messageInput.value,
			time: new Date(),
		})
		this.messageInput.value = ''
	}

	insertHelloMsg() {
		const cloneMessageFromCmsDiv = this.messageFromCmsDiv.content.cloneNode(
			true,
		)
		const messageContent = cloneMessageFromCmsDiv.querySelector('.message')
		messageContent.classList.add('loading')
		this.messagesWrap.appendChild(cloneMessageFromCmsDiv)

		messageContent.classList.remove('loading')
		messageContent.querySelector(
			'.timestamp',
		).innerText = new Date().toLocaleTimeString('en-IN', {
			timeZone: 'Asia/Taipei',
		})
		messageContent.querySelector('.messageText').innerHTML =
			'How can I help you?'
		messageContent.classList.add('newMessageBounce')
	}

	appendMessageFromCms({ userId, message, time }) {
		const cloneMessageFromCmsDiv = this.messageFromCmsDiv.content.cloneNode(
			true,
		)
		cloneMessageFromCmsDiv
			.querySelector('.message')
			.classList.add('newMessageBounce')
		cloneMessageFromCmsDiv.querySelector('.timestamp').innerText =
			new Date(time) > new Date()
				? new Date(time).toLocaleString('en-IN', {
						timeZone: 'Asia/Taipei',
				  })
				: new Date(time).toLocaleTimeString('en-IN', {
						timeZone: 'Asia/Taipei',
				  })

		cloneMessageFromCmsDiv.querySelector('.messageText').innerText = message
		this.messagesWrap.appendChild(cloneMessageFromCmsDiv)
		this.messagesWrap.lastElementChild.scrollIntoView({ behavior: 'smooth' })
	}

	appendMessageFromUser({ userId, message, time }) {
		const cloneMessageFromCmsDiv = this.messageFromUserDiv.content.cloneNode(
			true,
		)
		cloneMessageFromCmsDiv
			.querySelector('.message')
			.classList.add('newMessageBounce')
		cloneMessageFromCmsDiv.querySelector('.timestamp').innerText =
			new Date(time) > new Date()
				? new Date(time).toLocaleString('en-IN', {
						timeZone: 'Asia/Taipei',
				  })
				: new Date(time).toLocaleTimeString('en-IN', {
						timeZone: 'Asia/Taipei',
				  })
		cloneMessageFromCmsDiv.querySelector('.messageText').innerText = message
		this.messagesWrap.appendChild(cloneMessageFromCmsDiv)
		this.messagesWrap.lastElementChild.scrollIntoView({
			behavior: 'smooth',
		})
	}

	closeChatWindow() {
		this.chatbotContainer.style.display = 'none'
		this.showChatWindowBtn.style.display = 'block'
	}

	showChatWindow() {
		this.chatbotContainer.style.display = 'flex'
		this.showChatWindowBtn.style.display = 'none'
		this.messagesWrap.lastElementChild.scrollIntoView({ behavior: 'smooth' })
	}

	socketInit() {
		const { id, name } = this.userInfo
		this.room = id + '_' + this.adminId
		this.socket.emit('heartbeat', 'Chatbot')
		this.socket.emit('newUserGetOnline', {
			userId: id,
			username: name,
			room: this.room,
		})
		this.socket.emit('userJoinRoom', {
			userId: id,
			username: name,
			room: this.room,
		})
		this.socket.on('greetNewUser', (data) => {
			this.appendMessageFromCms(data)
			this.insertHelloMsg()
		})
		this.socket.on('getHistory', this.getHistory)

		this.socket.on('getMainPagePopAd', (data) => {
			helper.style.display = 'flex'
			helper.innerText = data
			helper.addEventListener('click', function () {
				helper.style.display = 'none'
			})
		})

		this.socket.on('newMessageFromCMS', (data) => {
			console.log(data)
			this.appendMessageFromCms(data)
		})

		this.socket.on('newBroadcast', (data) => {
			this.appendMessageFromCms(data)
		})
	}

	getHistory = async (history) => {
		const parsedHistory = Array.from(JSON.parse(history.messages))

		parsedHistory.forEach((info) => {
			if (info.userId === this.userInfo.id) {
				this.appendMessageFromUser(info)
			} else {
				this.appendMessageFromCms(info)
			}
		})
	}
}

customElements.define('stylish-chatbot', Chatbot)
