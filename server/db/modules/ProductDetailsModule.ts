import { Connection, EntityManager, InsertResult, Repository } from 'typeorm'
import { ProductDetails } from '../entities/ProductDetails'

export class ProductDetailsModule {
	client?: Connection
	tag: string
	Repo: Repository<ProductDetails>

	constructor(opt: { client?: Connection; transaction?: EntityManager }) {
		const { client, transaction } = opt
		this.client = client

		if (transaction) {
			this.Repo = transaction.getRepository(ProductDetails)
		} else if (this.client) {
			this.Repo = this.client.getRepository(ProductDetails)
		}
		this.tag = 'productModule/'
	}

	async getAllProductDetails() {
		try {
			return await this.Repo.createQueryBuilder().getMany()
		} catch (error) {
			throw error
		}
	}

	async getProductVariantById(id: string) {
		try {
			return await this.Repo.createQueryBuilder()
				.where('id = :id', {
					id,
				})
				.getOne()
		} catch (error) {
			throw error
		}
	}

	async createProductDetails(
		values: Partial<ProductDetails>[],
	): Promise<InsertResult> {
		try {
			return await this.Repo.createQueryBuilder()
				.insert()
				.into(ProductDetails)
				.values(values)
				.execute()
		} catch (error) {
			throw error
		}
	}
}
