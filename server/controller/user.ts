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

class User {
	s3config: ClientConfiguration
	uploadImg
	upload
	constructor() {
		this.s3config = new AWS.S3({
			accessKeyId: config.get('aws.s3.accessKeyId'),
			secretAccessKey: config.get('aws.s3.secretAccessKey'),
			Bucket: config.get('aws.s3.bucket'),
		})

		this.upload = multer({
			storage: multerS3({
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
		} catch (err) {
			next(err)
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
		} catch (err) {
			next(err)
		}
	}

	profile: StylishRouter = async (req, res, next) => {
		try {
			const access_token = req.get('Authorization')
			if (!access_token) throw new Error(customErrors.FORBIDDEN.type)

			const result = await UserService.profile(access_token.split(' ')[1])
			res.send(result)
		} catch (err) {
			next(err)
		}
	}
}

export = new User()
