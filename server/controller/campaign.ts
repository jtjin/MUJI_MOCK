import { StylishRouter } from '../infra/interfaces/express'
import CampaignService from '../service/campaign'

class Campaign {
	getCampaigns: StylishRouter = async (req, res) => {
		const result = { data: await CampaignService.getCampaigns() }
		res.send(result)
	}

	createCampaign: StylishRouter = async (req, res) => {
		const { id, story } = req.body

		await CampaignService.createCampaign({
			id,
			story,
			url: `/${req.files.image[0].key}`,
		})
	}
}

export = new Campaign()
