import config from 'config'
import logger from './server/utils/logger'
import express from 'express'
import bodyParser from 'body-parser'
import StylishRDB from './server/db'
import { handleError } from './server/middleWares/errorHandler'
import { Server } from 'http'
import cookieParser from 'cookie-parser'
import { disconnectRedis } from './server/db/redisDb'
import ErrorController from './server/controller/error'
import { socketIoInit } from './server/webSocket/index'
import { rootPath } from './server/utils'

const env = process.env.NODE_ENV || 'development'
const app = express()
export let dbConnection: any
const tag = 'server'

const initServer = async () => {
	try {
		const server = app.listen(config.get('port'))
		console.log(`--- [ ENV : ${env}]  ---`)
		console.log(`--- Stylish server running on port ${config.get('port')} ---`)
		await socketIoInit(server)
		dbConnection = StylishRDB.initDb()

		const _exitHandler = terminate(server, {
			coredump: false,
			timeout: 500,
		})
		// parse application/x-www-form-urlencoded
		app.use(
			bodyParser.urlencoded({
				extended: true,
			}),
		)
		// parse application/json
		app.use(bodyParser.json())

		app.use(cookieParser())
		app.set('json spaces', 2)
		app.use(express.json())
		app.use(express.urlencoded())

		/// CORS Control
		app.use('/api/', function (req, res, next) {
			res.set('Access-Control-Allow-Origin', '*')
			res.set(
				'Access-Control-Allow-Headers',
				'Origin, Content-Type, Accept, Authorization',
			)
			res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
			res.set('Access-Control-Allow-Credentials', 'true')
			next()
		})

		// API routes
		app.use('/api/' + config.get('api.version'), [
			require('./server/routes/user'),
			require('./server/routes/product'),
			require('./server/routes/chatRoom'),
			require('./server/routes/campaign'),
			// require('./server/routes/checkout'),
			// require('./server/routes/store_order_dta'),
		])

		app.set('view engine', 'html')
		app.set('views', rootPath + '/public/')
		app.use(express.static(rootPath + '/public'))

		app.use(ErrorController.get404)

		app.use(handleError)

		process.on('uncaughtException', _exitHandler(1, 'Unexpected Error'))
		process.on('unhandledRejection', _exitHandler(1, 'Unhandled Promise'))
		process.on('SIGTERM', _exitHandler(0, 'SIGTERM'))
		process.on('SIGINT', _exitHandler(0, 'SIGINT'))
	} catch (error) {
		console.log(error)
	}
}

function terminate(
	server: Server,
	options = { coredump: false, timeout: 500 },
) {
	return (code: number, reason: string) => async (
		err: Error,
		promise: Error,
	) => {
		const _exit = () => {
			options.coredump ? process.abort() : process.exit(code)
		}
		if (err && err instanceof Error) {
			logger.error({ tag, error: err })
		}
		server.close(_exit)
		await StylishRDB.disconnectDb()
		disconnectRedis()
		setTimeout(_exit, options.timeout).unref()
	}
}

initServer()

module.exports = {
	app,
}
