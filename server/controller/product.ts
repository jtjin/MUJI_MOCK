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
			// TODO: Add product main category ex: clothes, stationary...
			const productId = await ProductService.createProduct(req.body, req.files)
			if (productId) this.renameProductImages({ productId })
			res.send({
				result: 'success',
				data: productId,
			})
		} catch (error) {
			logger.error({ tag: tag + '/createProduct', error })
			next(error)
		}
	}

	getProductsListByTag: StylishRouter = async (req, res, next) => {
		const { bodyTag } = req.params
		const { keyword, id } = req.query
		let page
		console.log('req.query.paging=>', req.query.paging)

		if (req.query.paging && typeof req.query.paging === 'string') {
			page = req.query.paging
		} else {
			page = '1'
		}
		try {
			switch (bodyTag) {
				case 'women':
				case 'men':
				case 'accessories':
				case 'all':
					const tagId = TagsEnum[bodyTag]
					res.send(
						await ProductService.getProductsListByTag({
							tagId,
							page,
						}),
					)
					break

				case 'search':
					res.send(
						await ProductService.getProductsListByTag({
							titleLike: String(keyword),
							page,
						}),
					)
					break
				case 'details':
					res.send(await ProductService.getProductDetailById(String(id)))
					break
				default:
					throw new ErrorHandler(
						403,
						ErrorType.ValidationError,
						'Request Error: Invalid product category',
					)
			}
		} catch (error) {
			next(error)
		}
	}

	renameProductImages = async (opt: { productId: string }) => {
		try {
			const { productId } = opt
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
			throw error
		}
	}
}

export = new Product()
