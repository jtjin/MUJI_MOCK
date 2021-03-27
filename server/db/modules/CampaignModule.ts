import { Connection, EntityManager, Repository } from 'typeorm'
import { Campaign } from '../entities/Campaign'

export class CampaignModule {
	client?: Connection
	tag: string
	Repo: Repository<Campaign>

	constructor(opt: { client?: Connection; transaction?: EntityManager }) {
		const { client, transaction } = opt
		this.client = client

		if (transaction) {
			this.Repo = transaction.getRepository(Campaign)
		} else if (this.client) {
			this.Repo = this.client.getRepository(Campaign)
		}
		this.tag = 'campaignModule/'
	}

	async getCampaigns() {
		return await this.Repo.createQueryBuilder('c')
			.select('c.id , c.story, c.url AS picture')
			.getRawMany()
	}

	async createCampaign(id: string, story: string, url: string) {
		return await this.Repo.createQueryBuilder()
			.insert()
			.into(Campaign)
			.values([{ id, story, url }])
			.execute()
	}
}
