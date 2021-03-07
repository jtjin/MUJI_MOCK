import { Connection, EntityManager, InsertResult, Repository } from 'typeorm'
import { Tag } from '../entities/Tag'
import { Product } from '../entities/Product'
import { TagsEnum } from '../../infra/enums/Tags'

export class ProductModule {
	client: Connection | undefined
	tag: string
	Repo: Repository<Product>

	constructor(client?: Connection, transaction?: EntityManager | undefined) {
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
			.getMany()
	}

	async getProductsByTag(opt: {
		tag?: string
		titleLike?: string
		pagination?: { offset?: number; limit?: number }
		orderBy?: { sort: string; order: 'DESC' | 'ASC' }
	}) {
		const { tag, titleLike, pagination, orderBy } = opt

		const tags = TagsEnum[tag]

		let query = this.Repo.createQueryBuilder('product')
			.leftJoinAndSelect('product.variants', 'variants')
			.leftJoinAndSelect('product.images', 'images')
			.leftJoinAndSelect('product.main_image', 'main_image')

		if (tags) {
			query = query.where('product.tag_id = :tagId', {
				tagId: tags,
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
			if (offset) query = query.offset(offset)
		}

		const result = await query.getMany()

		return result
	}

	async createProduct(values: {
		title: string
		description: string
		price: number
		texture: string
		wash: string
		place: string
		note: string
		story: string
		tag_id: Tag
	}): Promise<InsertResult> {
		return await this.Repo.createQueryBuilder()
			.insert()
			.into(Product)
			.values([values])
			.execute()
	}
}
