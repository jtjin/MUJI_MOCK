import StylishRDB from '../db/index'
import { ProductModule } from '../db/modules/ProductModule'
import { ProductDetailsModule } from '../db/modules/ProductDetailsModule'
import { ImagesModule } from '../db/modules/ImagesModule'
import { MainImagesModule } from '../db/modules/MainImagesModule'
import { Product } from '../db/entities/Product'
import { MainImages } from '../db/entities/MainImages'
import { Images } from '../db/entities/Images'
import * as R from 'ramda'
import { ProductDetails } from '../db/entities/ProductDetails'
import { EntityManager, getConnection } from 'typeorm'
import { TagsEnum } from '../infra/enums/Tags'
import { CategoryEnum } from '../infra/enums/Category'
import { redisClient } from '../db/redisDb'
import { safeAwait } from '../utils/safeAsync'
import { customErrors } from '../infra/customErrors'
import { stringValue } from 'aws-sdk/clients/iot'
import { ErrorType } from '../infra/enums/errorType'
import { ErrorHandler } from '../middleWares/errorHandler'
const tag = 'server/product'
class ProductService {
	tag: string
	constructor() {
		this.tag = 'ProductService'
	}
	async getProductsListByTag(opt: {
		categoryId?: string
		tagId?: string
		titleLike?: string
		page?: string
	}) {
		const { tagId, titleLike, categoryId, page = 1 } = opt

		try {
			const [_error, resultCache] = await safeAwait(
				redisClient.get(`product:${categoryId}:${tagId}:${titleLike}:${page}`),
				tag + this.tag + '/getProductsListByTag/redis',
			)
			if (resultCache) return JSON.parse(String(resultCache))

			const productPO = await StylishRDB.productModule.getProductsByTag({
				tagId,
				titleLike,
				categoryId,
				pagination: {
					offset: (Number(page) - 1) * 6,
					limit: 6 + 1,
				},
			})

			const result: {
				data?: Product[]
				next_paging?: number
			} = {}

			if (productPO.length === 6 + 1) {
				productPO.pop()
				result.next_paging = Number(page) + 1
			}

			result.data = this._formatProductList(productPO)

			if (!result.data) return
			await safeAwait(
				redisClient.set(
					`product:${categoryId}:${tagId}:${titleLike}:${page}`,
					JSON.stringify(result),
				),
				tag + this.tag + '/getProductsListByTag/redis',
			)
			return result
		} catch (error) {}
	}

	async getProductDetailById(id: string) {
		try {
			const [_error, resultCache] = await safeAwait(
				await redisClient.get(`product:detail:${id}`),
				tag + this.tag + '/getProductDetailById/redis/get',
			)
			if (resultCache) return JSON.parse(String(resultCache))

			const productPO = await StylishRDB.productModule.getProductDetailById(id)

			if (!productPO) throw new Error(customErrors.PRODUCT_NOT_FOUND.type)

			await safeAwait(
				redisClient.set(
					`product:detail:${id}`,
					JSON.stringify(JSON.stringify([productPO][0])),
				),
				tag + this.tag + '/getProductDetailById/redis/set',
			)

			return productPO
		} catch (error) {
			throw error
		}
	}
	async getProductVariantById(id: string) {}

	async getPhotosByProductId(productId: string) {
		try {
			return {
				images: await StylishRDB.imagesModule.getImagesById(productId),
				main_image: await StylishRDB.mainImagesModule.getMainImagesById(
					productId,
				),
			}
		} catch (error) {
			throw error
		}
	}

	async createProduct(
		reqVO: {
			title: string
			description: string
			price: number
			texture: string
			wash: string
			place: string
			note: string
			story: string
			category: CategoryEnum
			tag: TagsEnum
			colors: string
			colorsName: string
			sizes: string
			spec: string[]
			variants: stringValue
			mainSpecVariantName: string[]
			subSpecVariantName: string[]
		},
		files: any,
	): Promise<{ productId: string } | undefined> {
		const productVO = {
			tag_id: TagsEnum[reqVO.tag],
			spec: reqVO.spec.join(','),
			category: CategoryEnum[reqVO.category],
			variants: JSON.parse(reqVO.variants),
			main_specs: reqVO.mainSpecVariantName.join(','),
			sub_specs: reqVO.subSpecVariantName.join(','),
			...R.pick(
				['title', 'description', 'texture', 'wash', 'place', 'note', 'story'],
				reqVO,
			),
		}
		let productId: string | undefined, productDetailId: string | undefined
		try {
			await getConnection('stylish').transaction(async (trans) => {
				const productModule = new ProductModule({ transaction: trans })
				const insertedResult = await productModule.createProduct(productVO)
				productId = insertedResult.raw.insertId as string

				if (!productId)
					throw new ErrorHandler(
						500,
						ErrorType.DatabaseError,
						'Fail to create product...',
					)

				productVO.variants.forEach(
					(variant: {
						product_id: string
						main_spec: string
						sub_spec: string
						price: number
						stock: number
						code: string
					}) => {
						variant.product_id = productId as string
					},
				)

				productDetailId = await this._createProductDetails({
					transaction: trans,
					variants: productVO.variants,
				})

				if (!productDetailId)
					throw new ErrorHandler(
						500,
						ErrorType.DatabaseError,
						'Fail to create product details...',
					)

				await this._createdPhotos({ transaction: trans, productId, files })
			})
			this._delProductCacheByTag({
				category: CategoryEnum[reqVO.category],
				tag: TagsEnum[reqVO.tag],
			})
			if (!productId || !productDetailId) return
			return { productId }
		} catch (error) {
			throw error
		}
	}

	async _createProductDetails(opt: {
		transaction: EntityManager
		variants: {
			product_id: string
			main_spec: string
			sub_spec: string
			price: number
			stock: number
			code: string
		}[]
	}) {
		try {
			const { transaction, variants } = opt
			const productDetailModule = new ProductDetailsModule({ transaction })
			const insertedResult = await productDetailModule.createProductDetails(
				variants,
			)
			return insertedResult.raw.insertId
		} catch (error) {
			throw error
		}
	}

	async _createdPhotos(opt: {
		transaction: EntityManager
		files: any
		productId: string
	}) {
		try {
			const { transaction, productId, files } = opt
			const { main_image, images } = files
			const mainImagesValueArr: Partial<MainImages>[] = []
			const imagesValueArr: Partial<Images>[] = []
			main_image.forEach((image: any, index: number) => {
				mainImagesValueArr[index] = {
					product_id: productId,
					name: 'main_image-' + index + '.' + image.key.split('.')[1],
					url: '/' + image.key,
				}
			})
			images.forEach((image: any, index: number) => {
				imagesValueArr[index] = {
					product_id: productId,
					name: 'images-' + index + '.' + image.key.split('.')[1],
					url: '/' + image.key,
				}
			})
			const imagesModule = new ImagesModule({ transaction })
			const mainImagesModule = new MainImagesModule({ transaction })
			await imagesModule.createImages(imagesValueArr)
			await mainImagesModule.createMainImages(mainImagesValueArr)
		} catch (error) {
			throw error
		}
	}

	async _delProductCacheByTag(opt: { category: string; tag: string }) {
		const { category, tag } = opt
		try {
			const [_error, productCacheKeys] = await safeAwait(
				redisClient.keys(`product:${category}:${tag}:*`),
				tag + this.tag + '/_delProductCacheByTag',
			)

			productCacheKeys.forEach(async (key: string) => {
				await safeAwait(
					redisClient.del(key),
					tag + this.tag + '/_delProductCacheByTag/productCacheKeys-forEach',
				)
			})
		} catch (error) {
			throw error
		}
	}

	async updateMainImageById(opt: { id: string; url: string }) {
		try {
			await StylishRDB.mainImagesModule.updateMainImageById(opt)
		} catch (error) {
			throw error
		}
	}

	async updateImageById(opt: { id: string; url: string }) {
		try {
			await StylishRDB.imagesModule.updateImageById(opt)
		} catch (error) {
			throw error
		}
	}

	_formatProductList(productPO: Product[]) {
		try {
			return productPO.map((productPO) => {
				const formatPO: any = { ...productPO }
				formatPO.images = productPO.images.map((image) => image.url)
				formatPO.main_image = productPO.main_image.url
				formatPO.highestPrice = -Infinity
				formatPO.lowestPrice = Infinity
				formatPO.variants.forEach((variant: any) => {
					if (variant.price > formatPO.highestPrice)
						formatPO.highestPrice = variant.price
					if (variant.price < formatPO.lowestPrice)
						formatPO.lowestPrice = variant.price
				})
				return formatPO
			})
		} catch (error) {
			throw error
		}
	}
}

export = new ProductService()
