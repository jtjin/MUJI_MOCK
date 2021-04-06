import jwt from 'jsonwebtoken'
import config from 'config'
import { customErrors } from '../infra/customErrors'
import MujiRDB from '../db/index'

class TokenHelper {
	async verifyToken(token: string) {
		try {
			const [identity, access_token] = (token || '').split(' ', 2)
			if (!identity) throw new Error(customErrors.AUTH_NO_IDENTITY.type)
			// @ts-ignore
			const { email } = jwt.verify(access_token, config.get('jwt.secret'))
			if (!email) throw new Error(customErrors.USER_NOT_FOUND.type)
			const userPO = await MujiRDB.userModule.getUserByEmail(email)
			return userPO
		} catch (err) {
			throw new Error(customErrors.AUTH_NO_TOKEN.type)
		}
	}

	generateToken(email: string, role: string) {
		try {
			const jwtExpireTime = Number(config.get('jwt.expireTime'))
			return (
				role +
				' ' +
				jwt.sign({ email }, config.get('jwt.secret'), {
					expiresIn: jwtExpireTime,
				})
			)
		} catch (error) {
			throw error
		}
	}
}

export = new TokenHelper()
