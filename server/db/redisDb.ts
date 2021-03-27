import config from 'config'
import * as asyncRedis from 'async-redis'
import logger from '../utils/logger'

const tag = '/db/redisDb'

export const redisClient = asyncRedis.createClient({
	host: String(config.get('redis.host')),
	port: Number(config.get('redis.port')),
	retry_strategy: function (options) {
		if (options.error && options.error.code === 'ECONNREFUSED') {
			return new Error('The server refused the connection')
		}
		if (options.total_retry_time > 1000 * 30) {
			return new Error('Retry time exhausted')
		}
		if (options.attempt > 10) {
			return undefined
		}
		return Math.min(options.attempt * 100, 3000)
	},
})

export const disconnectRedis = async () => {
	redisClient.quit()
}

redisClient.on('error', (error: Error) => {
	console.log(error)

	logger.error({
		tag,
		error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
	})
})

redisClient.on('ready', () => {
	logger.info({ tag, msg: `Redis ready on: ${process.env.NODE_ENV}` })
})

redisClient.on('connect', () => {
	logger.info({ tag, msg: `Redis connected on: ${process.env.NODE_ENV}` })
})
