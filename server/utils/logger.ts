import { createLogger, format } from 'winston'
import config from 'config'
import { inspect } from 'util'
import winston from 'winston'
import DailyRotateFile = require('winston-daily-rotate-file')

require('winston-mongodb')
require('winston-daily-rotate-file')

const logsDb = config.get('logger.db.host')
const logsCollection = config.get('logger.collection')

export const logger = createLogger({
	level: 'debug',
	transports: createLoggerTransports(),
	exitOnError: false,
	format: format.combine(format.timestamp()),
})

function createLoggerTransports() {
	const transports = []

	// Save logs file to folders
	transports.push(
		new DailyRotateFile({
			filename: './logs/MUJI-%DATE%.log',
			datePattern: 'YYYY-MM-DD-HH',
			zippedArchive: true,
			maxSize: '20m',
			maxFiles: '14d',
			format: format.combine(
				format((info) => {
					const formatInfo = info
					formatInfo.message = formatMsgByType(info.message)
					return formatInfo
				})(),
				format.json(),
			),
		}),
	)

	// Create console logs
	transports.push(
		new winston.transports.Console({
			level: 'debug',
			format: format.combine(
				format.printf((info) => {
					const formatInfo = info
					formatInfo.message = formatMsgByType(info.message)
					const formattedDate = info.timestamp
						.replace('T', ' ')
						.replace('Z', '')

					return `${formattedDate}|${info.level}|${consoleOutLogsMsg(
						formatInfo.message,
					)};`
				}),
			),
		}),
	)

	// Save logs to mongo DB
	transports.push(
		// @ts-ignore
		new winston.transports.MongoDB({
			level: 'info',
			db: logsDb,
			collection: logsCollection,
			format: format.combine(format.timestamp(), format.json()),
		}),
	)
	return transports
}

function formatMsgByType(message: string | Object) {
	if (typeof message === 'string') {
		return { msg: message }
	} else if (typeof message === 'object') {
		return _formatObject(message)
	}
}

function consoleOutLogsMsg(msg: any) {
	if (!(msg instanceof Object)) return msg
	const output = _formatObject(msg)
	return inspect(output)
}

function _formatObject(msg: any): any {
	const output: any = {}
	Object.keys(msg).forEach((key) => {
		if (msg[key] instanceof Error || key === 'error') {
			const { stack, message, ...meta } = msg[key]
			output[key] = { message, meta, stack }
			return
		}
		output[key] = msg[key]
	})
	return output
}

logger.stream = {
	// @ts-ignore
	write: (message: string, encoding: any) => {
		logger.info(message.trim())
	},
}

export default logger
