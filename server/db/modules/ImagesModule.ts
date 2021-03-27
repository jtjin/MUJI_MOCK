import {
	Connection,
	EntityManager,
	InsertResult,
	Repository,
	UpdateResult,
} from 'typeorm'
import { Images } from '../entities/Images'

export class ImagesModule {
	client: Connection | undefined
	tag: string
	Repo: Repository<Images>

	constructor(opt: {
		client?: Connection
		transaction?: EntityManager | undefined
	}) {
		const { client, transaction } = opt

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

	async getImagesById(id: string) {
		return await this.Repo.createQueryBuilder()
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

	async updateImageById(opt: {
		id: string
		url: string
	}): Promise<UpdateResult> {
		const { id, url } = opt
		return await this.Repo.createQueryBuilder()
			.update(Images)
			.set({ url: url })
			.where('id = :id', { id })
			.execute()
	}
}
