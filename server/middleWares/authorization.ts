import { customErrors } from '../infra/customErrors'
import { MujiRouter } from '../infra/interfaces/express'

import TokenHelper from '../helpers/token'

export const isAuth: MujiRouter = async (req, res, next) => {
	const access_token = req.get('Authorization')
	if (!access_token) throw new Error(customErrors.AUTH_NO_TOKEN.type)
	const userPO = await TokenHelper.verifyToken(access_token)
	if (!userPO) throw new Error(customErrors.USER_NOT_FOUND.type)
	req.me = userPO
	next()
}
