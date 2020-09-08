import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
	id: string;
	email: string;
}

export const getUser = (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization as string | undefined;
	console.log('here : ', token);
	if (!token) {
		next();
	} else {
		try {
			console.log('im rungningi');
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
