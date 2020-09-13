import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
	id: string;
	email: string;
}

export const getUser = (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization as string | undefined;
	if (!token) {
		next();
	} else {
		try {
			const payload = jwt.verify(
				token,
				process.env.JWT_SECRET!
			) as UserPayload;
			req.currentUser = payload;
			next();
		} catch (err) {
			next();
		}
	}
};
