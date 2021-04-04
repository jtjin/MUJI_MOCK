import { StylishRouter } from '../infra/interfaces/express'
import ProductService from '../service/product'
import { ErrorType } from '../infra/enums/errorType'
import { ErrorHandler } from '../middleWares/errorHandler'
import AWS from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'
import config from 'config'
import logger from '../utils/logger'
import crypto from 'crypto'
import { TagsEnum } from '../infra/enums/Tags'
import { CategoryEnum } from '../infra/enums/Category'

const tag = 'controller/product'

class Product {
	s3SDK: AWS.S3
	uploadImg
	upload

	constructor() {
		this.s3SDK = new AWS.S3({
			accessKeyId: config.get('aws.s3.accessKeyId'),
			secretAccessKey: config.get('aws.s3.secretAccessKey'),
			//@ts-ignore
			Bucket: config.get('aws.s3.bucket'),
		})

		this.upload = multer({
			storage: multerS3({
				s3: this.s3SDK,
				bucket: config.get('aws.s3.productImagesFolder'),
				acl: 'public-read',
				key: this.stylishUpload,
			}),
		})

		this.uploadImg = this.upload.fields([
			{
				name: 'main_image',
				maxCount: 5,
			},
			{
				name: 'images',
				maxCount: 5,
			},
		])
	}

	stylishUpload = async (req: any, file: any, cb: any) => {
		const nowMillionSeconds = new Date().getTime().toString()
		const fileExtension = file.mimetype.split('/')[1] // get file extension from original file name
		const customFilesName =
			nowMillionSeconds.substr(-5, 5) +
			crypto.randomBytes(18).toString('hex').substr(0, 8)
		cb(null, customFilesName + '.' + fileExtension)
	}

	createProduct: StylishRouter = async (req, res, next) => {
		try {
			if (!req.files)
				throw new ErrorHandler(
					500,
					ErrorType.ClientError,
					'No Images provided...',
				)
			const result = await ProductService.createProduct(req.body, req.files)
			if (!result)
				throw new ErrorHandler(
					500,
					ErrorType.DatabaseError,
					'Fail to create new product ...',
				)
			const { productId } = result
			if (productId) await this.renameProductImages({ productId })
			res.send({
				result: 'success',
				data: productId,
			})
		} catch (error) {
			logger.error({ tag: tag + '/createProduct', error })
			next(error)
		}
	}

	getProductDetail: StylishRouter = async (req, res, next) => {
		try {
			const { id } = req.query
			const data = await ProductService.getProductDetailById(id as string)

			res.send({ result: 'success', data })
		} catch (error) {
			logger.error({ tag: tag + '/getProductDetail', error })
			next(error)
		}
	}

	getProductsListByTag: StylishRouter = async (req, res, next) => {
		const query: {
			category?: CategoryEnum
			keyword?: string
			paging?: string
			tag?: TagsEnum
		} = req.query

		const { paging = '1', tag = 'all', category = 'all', keyword } = query

		try {
			res.send(
				await ProductService.getProductsListByTag({
					titleLike: keyword,
					tagId: TagsEnum[tag] as string,
					page: paging as string,
					categoryId: CategoryEnum[category] as string,
				}),
			)
		} catch (error) {
			logger.error({ tag: tag + '/getProductsListByTag', error })
			next(error)
		}
	}

	renameProductImages = async (opt: { productId: string }) => {
		try {
			const { productId } = opt
			if (!productId) return
			const { main_image, images } = await ProductService.getPhotosByProductId(
				productId,
			)
			main_image.forEach(async (img) => {
				await this._updateAWSS3Images(
					img.url.slice(1),
					`${productId}/${img.name}`,
				)
				await ProductService.updateMainImageById({
					id: img.id,
					url: `/${productId}/${img.name}`,
				})
			})

			images.forEach(async (img) => {
				await this._updateAWSS3Images(
					img.url.slice(1),
					`${productId}/${img.name}`,
				)
				await ProductService.updateImageById({
					id: img.id,
					url: `/${productId}/${img.name}`,
				})
			})
		} catch (error) {
			logger.error({ tag: tag + '/renameProductImages', error })
			throw error
		}
	}

	_updateAWSS3Images = async (oldKey: string, newKey: string) => {
		try {
			await this.s3SDK
				.copyObject({
					Bucket: config.get('aws.s3.bucket'),
					CopySource: config.get('aws.s3.productImagesFolder') + '/' + oldKey,
					Key: 'Stylish/products/' + newKey,
					ACL: 'public-read',
				})
				.promise()

			await this.s3SDK
				.deleteObject({
					Bucket: config.get('aws.s3.productImagesFolder'),
					Key: oldKey,
				})
				.promise()
		} catch (error) {
			logger.error({ tag: tag + '/_updateAWSS3Images', error })
			throw error
		}
	}
}

export = new Product()
