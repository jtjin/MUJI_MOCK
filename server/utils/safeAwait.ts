import logger from './logger'

const nativeExceptions = [
	EvalError,
	RangeError,
	ReferenceError,
	SyntaxError,
	TypeError,
	URIError,
].filter((except) => typeof except === 'function')

function throwNative(error: any, tag: string) {
	for (const Exception of nativeExceptions) {
		if (error instanceof Exception) {
			throw error
		}
	}
}

export function safeAwait(promise: any, tag: string, finallyFunc?: any) {
	return promise
		.then((data: any) => {
			if (data instanceof Error) {
				throwNative(data, tag)
				logger.error({ tag, data })
				return [data]
			}
			return [undefined, data]
		})
		.catch((error: Error) => {
			throwNative(error, tag)
			logger.error({ tag, error })
			return [error]
		})
		.finally(() => {
			if (finallyFunc && typeof finallyFunc === 'function') {
				finallyFunc()
			}
		})
}
