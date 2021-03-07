import { Connection } from 'typeorm'
import { Campaign } from '../entities/Campaign'

export class CampaignModule {
	client: Connection
	tag: string

	constructor(client: Connection) {
		this.client = client
		this.tag = 'campaignModule/'
	}

	async getCampaigns() {
		return await this.client
			.getRepository(Campaign)
			.createQueryBuilder('c')
			.select('c.id , c.story, c.url AS picture')
			.getRawMany()
	}

	async createCampaign(id: string, story: string, url: string) {
		return await this.client
			.createQueryBuilder()
			.insert()
			.into(Campaign)
			.values([{ id, story, url }])
			.execute()
	}
}
