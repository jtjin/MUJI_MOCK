import StylishRDB from '../db/index'

class CampaignService {
	async getCampaigns() {
		try {
			return await StylishRDB.campaignModule.getCampaigns()
		} catch (error) {
			throw error
		}
	}

	async createCampaign(opt: { id: string; story: string; url: string }) {
		const { id, story, url } = opt
		try {
			return await StylishRDB.campaignModule.createCampaign(id, story, url)
		} catch (error) {
			throw error
		}
	}
}

export = new CampaignService()
