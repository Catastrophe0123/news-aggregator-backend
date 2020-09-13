import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/unauthorized-error';

interface UserPayload {
	id: string;
	email: string;
}

declare global {
	namespace Express {
		interface Request {
			currentUser?: UserPayload;
		}
	}
}

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
	// code
	const token = req.headers.authorization as string | undefined;
	if (!token) {
		throw new UnauthorizedError('Cannot access this route');
	}

	try {
		const payload = jwt.verify(
			token,
			process.env.JWT_SECRET!
		) as UserPayload;
		req.currentUser = payload;
	} catch (err) {
		throw new UnauthorizedError('Cannot access this route');
	}

	next();
};
