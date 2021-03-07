import StylishRDB from '../db/index'

class CampaignService {
	async getCampaigns() {
		return await StylishRDB.campaignModule.getCampaigns()
	}

	async createCampaign(opt: { id: string; story: string; url: string }) {
		const { id, story, url } = opt
		return await StylishRDB.campaignModule.createCampaign(id, story, url)
	}
}

export = new CampaignService()
