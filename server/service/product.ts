import StylishRDB from '../db/index'
const { dbConnection } = require('../db/index')
import { ProductModule } from '../db/modules/ProductModule'
import { ProductDetailsModule } from '../db/modules/ProductDetailsModule'
import { ImagesModule } from '../db/modules/ImagesModule'
import { MainImagesModule } from '../db/modules/MainImagesModule'
import { Product } from '../db/entities/Product'
import { MainImages } from '../db/entities/MainImages'
import { Images } from '../db/entities/Images'
import * as R from 'ramda'
import { ProductDetails } from '../db/entities/ProductDetails'
import { Connection, EntityManager, getConnection, getManager } from 'typeorm'
import { TagsEnum } from '../infra/enums/Tags'
import { Tag } from '../db/entities/Tag'

class ProductService {
	async createProduct(reqVO: {
		title: string
		description: string
		price: number
		texture: string
		wash: string
		place: string
		note: string
		story: string
		tag: Tag
		colors: string
		colorsName: string
		sizes: string
	}): Promise<string | undefined> {
		console.log('TagsEnum[reqVO.tag]==>', TagsEnum[reqVO.tag])

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

		await getConnection('stylish').transaction(async (trans) => {
			const productModule = new ProductModule(undefined, trans)
			const insertedResult = await productModule.createProduct(productVO)
			productId = insertedResult.raw.insertId
			if (typeof productId === 'number') {
				const result = await this.createProductDetails({
					transaction: trans,
					productId,
					...R.pick(['colors', 'colorsName', 'sizes'], reqVO),
				})
			}
		})

		return productId
	}

	async createdPhotos(files: any, body: any) {
		const { main_image, images } = files
		const { productId } = body
		const mainImagesValueArr: Partial<MainImages>[] = []
		const imagesValueArr: Partial<Images>[] = []
		main_image.forEach((image: any, index: number) => {
			mainImagesValueArr[index] = {
				product_id: productId,
				name: image.key.split('/')[1],
				url: '/' + image.key,
			}
		})
		images.forEach((image: any, index: number) => {
			imagesValueArr[index] = {
				product_id: productId,
				name: image.key.split('/')[1],
				url: '/' + image.key,
			}
		})
		await StylishRDB.imagesModule.createImages(imagesValueArr)
		await StylishRDB.mainImagesModule.createMainImages(mainImagesValueArr)
	}

	async createProductDetails(opt: {
		transaction: EntityManager
		productId: string
		colors: string
		colorsName: string
		sizes: string
	}) {
		const { transaction, productId, colors, colorsName, sizes } = opt
		const productDetailModule = new ProductDetailsModule(undefined, transaction)

		const colorsArr = colors.split(',')
		const colorsNameArr = colorsName.split(',')
		const sizesArr = sizes.split(',')

		let productDetailVariants: Partial<ProductDetails>[] = []

		colorsArr.forEach((color, colorsArrIndex) => {
			let temp: Partial<ProductDetails> = {
				color_code: color,
				name: colorsNameArr[colorsArrIndex],
			}
			sizesArr.forEach((size) => {
				const detailVariant = { ...temp }
				detailVariant.size = size
				detailVariant.product_id = productId
				productDetailVariants.push(detailVariant)
			})
		})

		return await productDetailModule.createProductDetails(productDetailVariants)
	}

	async getProductsListByTag(opt: {
		tag?: string
		titleLike?: string
		page?: string
	}) {
		const { tag, titleLike, page = 1 } = opt

		const productPO = await StylishRDB.productModule.getProductsByTag({
			tag,
			titleLike,
			pagination: {
				offset: (Number(page) - 1) * 6,
				limit: 6 + 1,
			},
		})
		// TODO: 存一份到 Redis
		const result: {
			data?: Product[]
			next_paging?: number
		} = {}

		if (productPO.length === 6 + 1) {
			productPO.pop()
			result.next_paging = Number(page) + 1
		}

		result.data = this._formatProductList(productPO)

		return result
	}

	_formatProductList(productPO: Product[]) {
		return productPO.map((productPO) => {
			const formatPO: any = { ...productPO, colors: [], sizes: [] }
			const colorsMapped: any = {}
			const sizeMapped: any = {}
			formatPO.images = productPO.images.map((image) => image.url)

			formatPO.main_image = productPO.main_image.url

			formatPO.variants = productPO.variants.map((variant: ProductDetails) => {
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
			})

			return formatPO
		})
	}

	async getProductDetailById(id: string) {
		const productPO = await StylishRDB.productModule.getProductDetailById(id)
		const result = { data: this._formatProductList(productPO)[0] }
		return result
	}
}

export = new ProductService()
