import path from 'path'

export const getKeyValue = <T extends object, U extends keyof T>(obj: T) => (
	key: U,
) => obj[key]

export const rootPath = path.dirname(
	require?.main?.filename ?? path.join(__dirname + '../..'),
)
