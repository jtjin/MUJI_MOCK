import { Request, Response, NextFunction, RequestHandler } from 'express'
import { User } from '../../db/entities/User'

export { Request, Response, NextFunction, RequestHandler }

export interface StylishRouter {
	(req: StylishRequest, res: Response, next: NextFunction): any
}

export interface StylishRequest extends Request {
	files: any
	me?: User
}
