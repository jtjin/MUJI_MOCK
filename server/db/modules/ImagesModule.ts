import { Connection, EntityManager, InsertResult, Repository } from 'typeorm'
import { Images } from '../entities/Images'

export class ImagesModule {
	client: Connection | undefined
	tag: string
	Repo: Repository<Images>

	constructor(client?: Connection, transaction?: EntityManager | undefined) {
		this.client = client
		if (transaction) {
			this.Repo = transaction.getRepository(Images)
		} else if (this.client) {
			this.Repo = this.client.getRepository(Images)
		}
		this.tag = 'productModule/'
	}

	async getAllMainImages() {
		return await this.Repo.createQueryBuilder().getMany()
	}

	async getMainImagesById(id: string) {
		return this.Repo.createQueryBuilder()
			.where('product_id = :id', {
				id,
			})
			.getMany()
	}

	async createImages(values: Partial<Images>[]): Promise<InsertResult> {
		return await this.Repo.createQueryBuilder()
			.insert()
			.into(Images)
			.values(values)
			.execute()
	}
}
