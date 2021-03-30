export const customErrors = {
	INTERNAL_SERVER_ERROR: { status: 500, type: 'INTERNAL_SERVER_ERROR' },
	USER_NOT_FOUND: { status: 403, type: 'USER_NOT_FOUND' },
	FORBIDDEN: { status: 403, type: 'FORBIDDEN' },
	AUTH_NO_TOKEN: { status: 403, type: 'FORBIDDEN' },
	AUTH_NO_IDENTITY: { status: 403, type: 'FORBIDDEN' },
}
