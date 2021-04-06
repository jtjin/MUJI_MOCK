import {
	Connection,
	EntityManager,
	InsertResult,
	Repository,
	UpdateResult,
} from 'typeorm'
import { MainImages } from '../entities/MainImages'

export class MainImagesModule {
	client: Connection | undefined
	tag: string
	Repo: Repository<MainImages>

	constructor(opt: {
		client?: Connection
		transaction?: EntityManager | undefined
	}) {
		const { client, transaction } = opt
		this.client = client
		if (transaction) {
			this.Repo = transaction.getRepository(MainImages)
		} else if (this.client) {
			this.Repo = this.client.getRepository(MainImages)
		}
		this.tag = 'productModule/'
	}

	async getAllMainImages() {
		try {
			return await this.Repo.createQueryBuilder().getMany()
		} catch (error) {
			throw error
		}
	}

	async getMainImagesById(id: string) {
		try {
			return this.Repo.createQueryBuilder()
				.where('product_id = :id', {
					id,
				})
				.getMany()
		} catch (error) {
			throw error
		}
	}

	async createMainImages(values: Partial<MainImages>[]): Promise<InsertResult> {
		try {
			return await this.Repo.createQueryBuilder()
				.insert()
				.into(MainImages)
				.values(values)
				.execute()
		} catch (error) {
			throw error
		}
	}

	async updateMainImageById(opt: {
		id: string
		url: string
	}): Promise<UpdateResult> {
		try {
			const { id, url } = opt
			return await this.Repo.createQueryBuilder()
				.update(MainImages)
				.set({ url: url })
				.where('id = :id', { id })
				.execute()
		} catch (error) {
			throw error
		}
	}
}
