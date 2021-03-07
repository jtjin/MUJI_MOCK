import { ErrorType } from '../../infra/enums/errorType'
import { customErrors } from '../../infra/customErrors'
import { ErrorRequestHandler } from 'express'
import { inspect } from 'util'
import logger from '../logger'

export class ErrorHandler extends Error {
	statusCode: number
	errorType: ErrorType
	message: string

	constructor(
		statusCode: number,
		errorType: ErrorType,
		message: string | Error,
	) {
		super()
		this.statusCode = statusCode
		this.errorType = errorType
		this.message = inspect(message)
	}
}

export const handleError: ErrorRequestHandler = (err, _req, res, _next) => {
	const { statusCode, errorType, message } = err

	const returnCustomError =
		customErrors[err.message as keyof typeof customErrors] ||
		customErrors.INTERNAL_SERVER_ERROR

	const data = err.data ? err.data : message
	try {
		res.status(
			statusCode ||
				returnCustomError.status ||
				customErrors.INTERNAL_SERVER_ERROR.status,
		)
		res.send({
			result: 'fail',
			error: { type: errorType || returnCustomError.type, data },
		})
	} catch (err) {
		logger.error({ tag: 'server/utils/handleError', error: err })
	}
}
