import { Request, Response, NextFunction, RequestHandler } from 'express'
import { User } from '../../db/entities/User'

export { Request, Response, NextFunction, RequestHandler }

export interface MujiRouter {
	(req: MujiRequest, res: Response, next: NextFunction): any
}

export interface MujiRequest extends Request {
	files: any
	me?: User
}
