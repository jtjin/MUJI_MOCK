import {
	Connection,
	EntityManager,
	InsertResult,
	Repository,
	UpdateResult,
} from 'typeorm'
import { Tag } from '../entities/Tag'
import { Product } from '../entities/Product'
import { TagsEnum } from '../../infra/enums/Tags'
import { CategoryEnum } from '../../infra/enums/Category'
import { getKeyValue } from '../../utils/index'

export class ProductModule {
	client?: Connection
	tag: string
	Repo: Repository<Product>

	constructor(opt: { client?: Connection; transaction?: EntityManager }) {
		const { client, transaction } = opt
		this.client = client
		if (transaction) {
			this.Repo = transaction.getRepository(Product)
		} else if (this.client) {
			this.Repo = this.client.getRepository(Product)
		}
		this.tag = 'productModule/'
	}

	async getAllProducts() {
		return await this.Repo.createQueryBuilder().getMany()
	}

	async getProductDetailById(id: string) {
		return this.Repo.createQueryBuilder('product')
			.leftJoinAndSelect('product.variants', 'variants')
			.leftJoinAndSelect('product.images', 'images')
			.leftJoinAndSelect('product.main_image', 'main_image')
			.where('product.id = :id', {
				id,
			})
			.getOne()
	}

	async getProductsByTag(opt: {
		categoryId?: string
		tagId?: string
		titleLike?: string
		pagination?: { offset?: number; limit?: number }
		orderBy?: { sort: string; order: 'DESC' | 'ASC' }
	}) {
		const { tagId, titleLike, pagination, orderBy, categoryId } = opt

		let query = this.Repo.createQueryBuilder('product')
			.leftJoinAndSelect('product.variants', 'variants')
			.leftJoinAndSelect('product.images', 'images')
			.leftJoinAndSelect('product.main_image', 'main_image')

		if (categoryId) {
			query = query.andWhere('product.category = :categoryId', {
				categoryId,
			})
		}
		if (tagId) {
			query = query.andWhere('product.tag_id = :tagId', {
				tagId,
			})
		}

		if (titleLike) {
			query = query.andWhere('product.title like :title', {
				title: `%${titleLike}%`,
			})
		}

		if (orderBy) {
			const { sort = 'id', order = 'DESC' } = orderBy
			query = query.orderBy(sort, order)
		}

		if (pagination) {
			const { limit, offset } = pagination
			if (limit) query = query.take(limit)
			if (offset) query = query.take(limit).skip(offset)
		}

		const result = await query.getMany()
		return result
	}

	async createProduct(values: {
		title: string
		description: string
		// price: number
		texture: string
		wash: string
		place: string
		note: string
		story: string
		spec: string
		tag_id: string
		category: string
	}): Promise<InsertResult> {
		console.log('DB--> createProduct ->', values)
		return await this.Repo.createQueryBuilder()
			.insert()
			.into(Product)
			.values(values)
			.execute()
	}

	async updateProductById(opt: {
		id: string
		value: any
	}): Promise<UpdateResult> {
		const { id, value } = opt
		return await this.Repo.createQueryBuilder()
			.update(Product)
			.set(value)
			.where('id = :id', { id })
			.execute()
	}
}
