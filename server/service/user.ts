import bcrypt from 'bcryptjs'
import MujiRDB from '../db/index'
import config from 'config'
import * as R from 'ramda'
import { customErrors } from '../infra/customErrors'
import { ErrorHandler } from '../middleWares/errorHandler'
import { ErrorType } from '../infra/enums/errorType'

import TokenHelper from '../helpers/token'
import { UserRole } from '../infra/enums/UserRole'
class User {
	async loginByEmail(reqVo: { email: string; password: string }) {
		const { email, password } = reqVo
		const userPO = await MujiRDB.userModule.getUserByEmail(email)
		if (!userPO) throw new Error(customErrors.USER_NOT_FOUND.type)

		if (this._validatePassword(password, userPO.password)) {
			throw new Error(customErrors.FORBIDDEN.type)
		}
		const access_token = await this._refreshAccessToken({
			email,
			role: userPO.role.name,
		})

		await MujiRDB.userModule.updateAccessToken(email, access_token)
		return {
			result: 'success',
			data: {
				...R.pick(['id', 'provider', 'name', 'email', 'picture'], userPO),
				access_token,
				access_expired: config.get('jwt.expireTime'),
			},
		}
	}

	_validatePassword(enteredPwd: string, existedPwd: string) {
		return !bcrypt.compareSync(enteredPwd, existedPwd)
	}

	async register(
		reqVO: {
			name: string
			email: string
			picture: object
			password: string
			provider: string
		},
		fileName?: string,
	) {
		const { name, email, picture, password, provider } = reqVO
		const ifUserExist = await MujiRDB.userModule.getUserByEmail(email)
		if (ifUserExist) {
			throw new ErrorHandler(
				403,
				ErrorType.ClientError,
				'User Already Exists...',
			)
		}
		if (provider === 'facebook') {
			return this._registerByFacebook({
				email,
				name,
				picture,
				role: UserRole.user,
			})
		} else if (provider === 'native') {
			return this._registerByEmail(
				{ email, name, password, role: UserRole.user },
				fileName,
			)
		} else {
			throw new Error(customErrors.FORBIDDEN.type)
		}
	}

	async _registerByFacebook(values: {
		email: string
		name: string
		picture: any
		role: string
	}) {
		const { email, name, picture, role = UserRole.user } = values
		const access_token = TokenHelper.generateToken(email, role)
		const insertedResult = await MujiRDB.userModule.createNewUser({
			name,
			email,
			access_token,
			picture: picture.data.url,
			provider: 'facebook',
			role,
		})
		return {
			data: {
				access_token,
				access_expired: config.get('jwt.expireTime'),
				id: insertedResult.raw.insertId,
				provider: 'facebook',
				name,
				email,
				picture: picture.data.url,
				role: role,
			},
		}
	}

	async _registerByEmail(
		values: { name: string; email: string; password: string; role: string },
		fileName?: string,
	) {
		const { name, email, password, role = UserRole.user } = values
		if (!password) throw new Error(customErrors.FORBIDDEN.type)

		const hashPwd = bcrypt.hashSync(password, 8)
		const access_token = TokenHelper.generateToken(email, role)

		const result = await MujiRDB.userModule.createNewUser({
			name,
			email,
			password: hashPwd,
			access_token,
			picture: fileName,
			provider: 'native',
		})

		return {
			data: {
				id: result.raw.insertId,
				provider: 'native',
				name,
				email,
				picture: fileName,
				access_token,
				access_expired: Number(config.get('jwt.expireTime')),
			},
		}
	}

	async loginByFB(token: string) {
		TokenHelper.verifyToken(token)
		const userPO = await MujiRDB.userModule.getUserByAccessToken(token)

		if (!userPO) throw new Error(customErrors.USER_NOT_FOUND.type)

		const tokenExpireTime = Number(config.get('jwt.expireTime'))

		const access_token = TokenHelper.generateToken(
			userPO.email,
			userPO.role.name,
		)

		await MujiRDB.userModule.updateAccessToken(userPO.email, access_token)

		return {
			data: {
				access_token,
				access_expired: tokenExpireTime,
				id: userPO.id,
				provider: 'facebook',
				name: userPO.name,
				email: `${userPO.email}`,
				picture: userPO.picture,
			},
		}
	}

	async profile(access_token: string) {
		try {
			const userPO = await MujiRDB.userModule.getUserByAccessToken(access_token)
			return {
				data: R.pick(['id', 'provider', 'name', 'email', 'picture'], userPO),
			}
		} catch (err) {
			throw new Error(customErrors.FORBIDDEN.type)
		}
	}

	async _refreshAccessToken(opt: {
		email: string
		role: string
	}): Promise<string> {
		const { email, role = UserRole.user } = opt
		return TokenHelper.generateToken(email, role)
	}
}

export = new User()
