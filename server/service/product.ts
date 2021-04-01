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
import { redisClient } from '../db/redisDb'
import logger from '../utils/logger'
import { safeAwait } from '../utils/safeAsync'
import { customErrors } from '../infra/customErrors'
const tag = 'server/product'
class ProductService {
	tag: string
	constructor() {
		this.tag = 'ProductService'
	}
	async getProductsListByTag(opt: {
		tagId?: TagsEnum
		titleLike?: string
		page?: string
	}) {
		const { tagId, titleLike, page = 1 } = opt
		console.log(tagId, titleLike, page)
		try {
			const [_error, resultCache] = await safeAwait(
				redisClient.get(`product:${tagId}:${titleLike}:${page}`),
				tag + this.tag + '/getProductsListByTag/redis',
			)
			if (resultCache) return JSON.parse(String(resultCache))

			const productPO = await StylishRDB.productModule.getProductsByTag({
				tagId,
				titleLike,
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
					`product:${tagId}:${titleLike}:${page}`,
					JSON.stringify(result),
				),
				tag + this.tag + '/getProductsListByTag/redis',
			)
			return result
		} catch (error) {}
	}

	async getProductDetailById(id: string) {
		try {
			const resultCache = await redisClient.get(`product:detail:${id}`)

			console.log('resultCache-->', resultCache)

			if (resultCache) return JSON.parse(String(resultCache))

			const productPO = await StylishRDB.productModule.getProductDetailById(id)

			if (!productPO) throw new Error(customErrors.PRODUCT_NOT_FOUND.type)

			const result = JSON.stringify(this._formatProductList([productPO])[0])

			await redisClient.set(`product:detail:${id}`, result)

			return result
		} catch (error) {
			throw error
		}
	}

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
			tag: TagsEnum
			colors: string
			colorsName: string
			sizes: string
		},
		files: any,
	): Promise<string | undefined> {
		const productVO = {
			tag_id: TagsEnum[reqVO.tag],
			...R.pick(
				[
					'title',
					'description',
					'price',
					'texture',
					'wash',
					'place',
					'note',
					'story',
				],
				reqVO,
			),
		}

		let productId
		try {
			await getConnection('stylish').transaction(async (trans) => {
				const productModule = new ProductModule({ transaction: trans })
				const insertedResult = await productModule.createProduct(productVO)
				productId = insertedResult.raw.insertId
				if (productId) {
					await this._createProductDetails({
						transaction: trans,
						productId,
						...R.pick(['colors', 'colorsName', 'sizes'], reqVO),
					})
				}
				await this._createdPhotos({ transaction: trans, productId, files })
			})
			this._delProductCacheByTag(TagsEnum[reqVO.tag])
			return productId
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

	async _createProductDetails(opt: {
		transaction: EntityManager
		productId: string
		colors: string
		colorsName: string
		sizes: string
	}) {
		try {
			const { transaction, productId, colors, colorsName, sizes } = opt
			const productDetailModule = new ProductDetailsModule({ transaction })

			const colorsArr = colors.split(',')
			const colorsNameArr = colorsName.split(',')
			const sizesArr = sizes.split(',')

			let productDetailVariants: Partial<ProductDetails>[] = []

			colorsArr.forEach((color, colorsArrIndex) => {
				let temp: Partial<ProductDetails> = {
					color_code: color.trim(),
					name: colorsNameArr[colorsArrIndex].trim(),
				}
				sizesArr.forEach((size) => {
					const detailVariant = { ...temp }
					detailVariant.size = size.trim()
					detailVariant.product_id = productId
					productDetailVariants.push(detailVariant)
				})
			})

			return await productDetailModule.createProductDetails(
				productDetailVariants,
			)
		} catch (error) {
			throw error
		}
	}

	async _delProductCacheByTag(tag: string) {
		try {
			const productCacheKeys = await redisClient.keys(`product:${tag}:*`)
			// @ts-ignore
			productCacheKeys.forEach((key) => {
				redisClient.del(key)
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
				const formatPO: any = { ...productPO, colors: [], sizes: [] }
				const colorsMapped: any = {}
				const sizeMapped: any = {}
				formatPO.images = productPO.images.map((image) => image.url)

				formatPO.main_image = productPO.main_image.url

				formatPO.variants = productPO.variants.map(
					(variant: ProductDetails) => {
						if (!colorsMapped[variant.color_code]) {
							formatPO.colors.push({
								code: variant.color_code,
								name: variant.name,
							})
							colorsMapped[variant.color_code] = variant.color_code
						}

						if (!sizeMapped[variant.size]) {
							formatPO.sizes.push(variant.size)
							sizeMapped[variant.size] = variant.size
						}

						return R.pick(['color_code', 'size', 'stock'], variant)
					},
				)

				return formatPO
			})
		} catch (error) {
			throw error
		}
	}
}

export = new ProductService()
