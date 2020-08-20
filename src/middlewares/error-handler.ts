import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.log('in the error handler');
	if (err instanceof CustomError) {
		return res
			.status(err.statusCode)
			.json({ errors: err.serializeError() });
	}
	console.log('something went wrong');
};
