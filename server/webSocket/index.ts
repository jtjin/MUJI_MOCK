import SocketIO from 'socket.io'
import { Socket } from 'socket.io'
export let io: any

export const init = (server: any) => {
	// @ts-ignore
	io = SocketIO(server)
	io.on('connection', (socket: Socket) => {
		socket.on('heartbeat', () => {
			console.log('TackBase webSocket is connected ... ')
		})
		socket.on('NewOrder', (data) => {
			io.emit('freshDashBoard')
		})
		console.log(`--- WebSocket Connected ---`)
	})
}
