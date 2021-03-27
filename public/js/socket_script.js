const socket = io()
//const socket = io('http://localhost:3000/');
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('messageInput')
const helper = document.getElementById('infoMessageBox')

let randomID = Math.floor(Math.random() * 1000)
let userId = localStorage.getItem('user_id') || randomID
let userName = localStorage.getItem('userName') || 'randomUser'
let room = userId

if (!localStorage.getItem('user_id')) {
	localStorage.setItem('user_id', randomID)
	localStorage.setItem('userName', userName)
}

socket.emit('userJoinRoom', { userId, room, userName })
socket.emit('newUserGetOnline', userId)

socket.on('greetNewUser', (data) => {
	getHistory(userId)
	appendMessage('System', data.message, data.time)
})

socket.on('getMainPagePopAd', (data) => {
	helper.style.display = 'flex'
	helper.innerText = data
	helper.addEventListener('click', function () {
		helper.style.display = 'none'
	})
})

socket.on('newBroadcast', (data) => {
	appendMessage(data.user, data.message, data.time)
})

messageForm.addEventListener('submit', (e) => {
	e.preventDefault()
	const message = messageInput.value
	socket.emit('send-newBroadcast', message)
	messageInput.value = ''
	messageInput.focus()
})

function appendMessage(user, message, time) {
	const messageElement = document.createElement('div')
	const message_name = document.createElement('span')
	const message_time = document.createElement('span')
	const message_text = document.createElement('span')
	messageElement.setAttribute('class', 'message')
	message_name.setAttribute('class', 'meta')
	message_text.setAttribute('class', 'text')
	message_time.setAttribute('class', 'time')
	if (user === 'admin') {
		message_name.innerText = 'Stella : '
	} else if (user === 'System') {
		message_name.innerText = 'System : '
	} else {
		message_name.innerText = 'You : '
	}
	message_time.innerText = time
	message_text.innerHTML = message
	messageElement.append(message_name)
	messageElement.append(message_text)
	messageElement.append(message_time)
	messageContainer.append(messageElement)
	messageElement.scrollIntoView()
}

socket.on('message', (data) => {
	appendMessage(`${data.message} ${data.time}`)
})

function getHistory(id) {
	fetch('/chatRoom/' + id, { method: 'GET' })
		.then((res) => res.json())
		.then((msg) => {
			for (i = 0; i < msg.length; i += 3) {
				appendMessage(msg[i], msg[i + 1], msg[i + 2])
			}
		})
}
