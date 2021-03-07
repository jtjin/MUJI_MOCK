import { Connection, EntityManager, InsertResult, Repository } from 'typeorm'
import { ProductDetails } from '../entities/ProductDetails'

export class ProductDetailsModule {
	client: Connection | undefined
	tag: string
	Repo: Repository<ProductDetails>

	constructor(client?: Connection, transaction?: EntityManager | undefined) {
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

	async getProductDetailsById(id: string) {
		return this.Repo.createQueryBuilder()
			.where('variants.id = :id', {
				id,
			})
			.getMany()
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
