import {
	Request,
	Response,
	NextFunction as Next,
	RequestHandler,
} from 'express'

export { Request, Response, Next, RequestHandler }

export interface StylishRouter {
	(req: StylishRequest, res: Response, next: Next): any
}

export interface StylishRequest extends Request {
	files: any
}
