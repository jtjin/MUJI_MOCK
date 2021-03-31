import { StylishRouter } from '../infra/interfaces/express'
import CampaignService from '../service/campaign'
import logger from '../utils/logger'

const tag = 'server/controller/campaign'
class Campaign {
	getCampaigns: StylishRouter = async (req, res, next) => {
		try {
			const result = { data: await CampaignService.getCampaigns() }
			res.send(result)
		} catch (error) {
			logger.error({ tag: tag + '/getCampaigns', error })
			next(error)
		}
	}

	createCampaign: StylishRouter = async (req, res, next) => {
		const { id, story } = req.body
		try {
			await CampaignService.createCampaign({
				id,
				story,
				url: `/${req.files.image[0].key}`,
			})
		} catch (error) {
			logger.error({ tag: tag + '/createCampaign', error })
			next(error)
		}
	}
}

export = new Campaign()
