import {
	Request,
	Response,
	NextFunction as Next,
	RequestHandler,
} from 'express'
import { User } from '../../db/entities/User'

export { Request, Response, Next, RequestHandler }

export interface StylishRouter {
	(req: StylishRequest, res: Response, next: Next): any
}

export interface StylishRequest extends Request {
	files: any
	me: User
}
