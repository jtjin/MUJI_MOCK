import { StylishRouter } from '../infra/interfaces/express'

class Error {
	get404: StylishRouter = async (req, res) => {
		res.redirect('/404.html')
	}
}

export = new Error()