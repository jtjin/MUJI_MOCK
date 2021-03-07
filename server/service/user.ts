import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import StylishRDB from '../db/index'
import config from 'config'
import * as R from 'ramda'
import { customErrors } from '../infra/customErrors'
import { ErrorHandler } from '../utils/middleWares/errorHandler'
import { ErrorType } from '../infra/enums/errorType'

class User {
	async loginByEmail(reqVo: { email: string; password: string }) {
		const { email, password } = reqVo
		const userPO = await StylishRDB.userModule.getUserByEmail(email)
		if (!userPO) throw new Error(customErrors.USER_NOT_FOUND.type)
		if (this._validatePassword(password, userPO.password)) {
			throw new Error(customErrors.FORBIDDEN.type)
		}
		const access_token = this._refreshAccessToken(email)
		await StylishRDB.userModule.updateAccessToken(email, access_token)
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
			password?: string
			provider: string
		},
		fileName?: string,
	) {
		const { name, email, picture, password, provider } = reqVO
		const ifUserExist = await StylishRDB.userModule.getUserByEmail(email)
		if (ifUserExist) {
			throw new ErrorHandler(
				403,
				ErrorType.ClientError,
				'User Already Exists...',
			)
		}
		if (provider === 'facebook') {
			return this._registerByFacebook({ email, name, picture })
		} else if (provider === 'native') {
			return this._registerByEmail({ email, name, password }, fileName)
		} else {
			throw new Error(customErrors.FORBIDDEN.type)
		}
	}

	async _registerByFacebook(values: {
		email: string
		name: string
		picture: any
	}) {
		const { email, name, picture } = values
		const jwtExpireTime = Number(config.get('jwt.expireTime'))
		const access_token = jwt.sign({ email }, config.get('jwt.secret'), {
			expiresIn: jwtExpireTime,
		})
		const insertedResult = await StylishRDB.userModule.createNewUser({
			name,
			email,
			access_token,
			picture: picture.data.url,
			provider: 'facebook',
		})
		return {
			data: {
				access_token,
				access_expired: jwtExpireTime,
				id: insertedResult.raw.insertId,
				provider: 'facebook',
				name,
				email,
				picture: picture.data.url,
			},
		}
	}

	async _registerByEmail(
		values: { name: string; email: string; password: string },
		fileName: string,
	) {
		const { name, email, password } = values

		if (!password) throw new Error(customErrors.FORBIDDEN.type)

		const hashPwd = bcrypt.hashSync(password, 8)
		console.log('hashPwd=>', hashPwd)

		const access_token = jwt.sign(
			{
				email,
			},
			config.get('jwt.secret'),
			{
				expiresIn: Number(config.get('jwt.expireTime')),
			},
		)

		const result = await StylishRDB.userModule.createNewUser({
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
		jwt.verify(token, config.get('jwt.secret'))

		const userPO = await StylishRDB.userModule.getUserByAccessToken(token)

		if (!userPO) throw new Error(customErrors.USER_NOT_FOUND.type)

		const tokenExpireTime = Number(config.get('jwt.expireTime'))

		const access_token = jwt.sign(
			{ email: userPO.email },
			config.get('jwt.secret'),
			{ expiresIn: Number(config.get('jwt.expireTime')) },
		)

		await StylishRDB.userModule.updateAccessToken(userPO.email, access_token)

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
			jwt.verify(access_token, config.get('jwt.secret'))
			const userPO = await StylishRDB.userModule.getUserByAccessToken(
				access_token,
			)
			return {
				data: R.pick(['id', 'provider', 'name', 'email', 'picture'], userPO),
			}
		} catch (err) {
			throw new Error(customErrors.FORBIDDEN.type)
		}
	}

	_refreshAccessToken(email: string) {
		return jwt.sign({ email }, config.get('jwt.secret'), {
			expiresIn: Number(config.get('jwt.expireTime')),
		})
	}
}

export = new User()
