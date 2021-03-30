import jwt from 'jsonwebtoken'
import config from 'config'
import { customErrors } from '../infra/customErrors'
import StylishRDB from '../db/index'

class TokenHelper {
	async verifyToken(token: string) {
		try {
			const [identity, access_token] = (token || '').split(' ', 2)
			if (!identity) throw new Error(customErrors.AUTH_NO_IDENTITY.type)
			// @ts-ignore
			const { email } = jwt.verify(access_token, config.get('jwt.secret'))
			const userPO = await StylishRDB.userModule.getUserByEmail(email)
			return userPO
		} catch (err) {
			throw err
		}
	}

	generateToken(email: string, role: string) {
		const jwtExpireTime = Number(config.get('jwt.expireTime'))
		return (
			role +
			' ' +
			jwt.sign({ email }, config.get('jwt.secret'), {
				expiresIn: jwtExpireTime,
			})
		)
	}
}

export = new TokenHelper()
