import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/Request-validation-error';
import { User } from '../models/user';

const signupHandler = (req: Request, res: Response) => {
	//code
	const errors = validationResult(req);
	if (!errors.isEmpty) {
		console.log(errors.array());
		throw new RequestValidationError(errors.array());
	}
	const { email, password } = req.body;

	// we have the email and the
	let newUser = User.build({ email, password });
	newUser.save();
	return res.status(201).json({ message: 'new user created' });
};

export { signupHandler };
