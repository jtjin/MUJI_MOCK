import { MujiRouter } from '../infra/interfaces/express'

class Error {
	get404: MujiRouter = async (req, res) => {
		res.redirect('/404.html')
	}
}

export = new Error()
