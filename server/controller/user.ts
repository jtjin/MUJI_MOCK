import { StylishRouter } from '../infra/interfaces/express'
import config from 'config'
import UserService from '../service/user'
import { ErrorType } from '../infra/enums/errorType'
import AWS from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'
import path from 'path'
import { ClientConfiguration } from 'aws-sdk/clients/acm'
import { customErrors } from '../infra/customErrors'
import logger from '../utils/logger'

const tag = 'controller/user'
class User {
	s3config: ClientConfiguration
	uploadImg
	upload
	constructor() {
		this.s3config = new AWS.S3({
			accessKeyId: config.get('aws.s3.accessKeyId'),
			secretAccessKey: config.get('aws.s3.secretAccessKey'),
			// @ts-ignore
			Bucket: config.get('aws.s3.bucket'),
		})

		this.upload = multer({
			storage: multerS3({
				// @ts-ignore
				s3: this.s3config,
				bucket: config.get('aws.s3.userImagesFolder'),
				acl: 'public-read',
				key: function (req: any, file: any, cb: any) {
					const { name, email } = req.body
					cb(null, `${email}/${name}${path.extname(file.originalname)}`)
				},
			}),
		})

		this.uploadImg = this.upload.fields([
			{
				name: 'userImage',
				maxCount: 3,
			},
		])
	}

	register: StylishRouter = async (req, res, next) => {
		try {
			const result = await UserService.register(
				req.body,
				`${req.body.email}/${req.body.name}${path.extname(
					req.files.userImage[0].originalname,
				)}`,
			)
			res.send({ access_token: result.data.access_token })
		} catch (error) {
			logger.error({ tag: tag + '/register', error })
			next(error)
		}
	}

	logIn: StylishRouter = async (req, res, next) => {
		try {
			if (req.body.provider === 'facebook') {
				const result = await UserService.loginByFB(req.cookies.access_token)
				res.send(result)
			} else if (req.body.provider === 'native') {
				const result = await UserService.loginByEmail(req.body)
				res.send(result)
			}
		} catch (error) {
			logger.error({ tag: tag + '/logIn', error })
			next(error)
		}
	}

	profile: StylishRouter = async (req, res, next) => {
		try {
			if (!req.me) throw new Error(customErrors.USER_NOT_FOUND.type)
			const result = await UserService.profile(req.me.access_token)
			res.send(result)
		} catch (error) {
			logger.error({ tag: tag + '/profile', error })
			next(error)
		}
	}
}

export = new User()
