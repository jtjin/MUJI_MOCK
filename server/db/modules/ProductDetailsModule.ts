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
		return await this.Repo.createQueryBuilder().getMany()
	}

	async getProductVariantById(id: string) {
		return await this.Repo.createQueryBuilder()
			.where('id = :id', {
				id,
			})
			.getOne()
	}

	async createProductDetails(
		values: Partial<ProductDetails>[],
	): Promise<InsertResult> {
		return await this.Repo.createQueryBuilder()
			.insert()
			.into(ProductDetails)
			.values(values)
			.execute()
	}
}
