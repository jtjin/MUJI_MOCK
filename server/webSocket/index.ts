import SocketIO from 'socket.io'
import { Socket } from 'socket.io'
// import registerOrderHandlers from './handlers/orderHandler'
import registerUserHandlers from './handlers/userHandler'

export let io: any

export const socketIoInit = (server: any) => {
	try {
		io = SocketIO(server)
		const onConnection = (socket: Socket) => {
			socket.on('heartbeat', (where) => {
				console.log(`--- ${where} WebSocket heartbeat ---`)
			})
			socket.on('sendMainPagePopAd', (msg) => {
				io.emit('getMainPagePopAd', msg)
			})
			// registerOrderHandlers(io, socket)
			new registerUserHandlers(io, socket)
		}
		io.on('connection', onConnection)
	} catch (error) {
		throw error
	}
}
