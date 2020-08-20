import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/Request-validation-error';

const signupHandler = (req: Request, res: Response) => {
	//code
	const errors = validationResult(req);
	if (!errors.isEmpty) {
		console.log(errors.array());
		throw new RequestValidationError(errors.array());
	}
	const { email, password } = req.body;

	// we have the email and the password
};

export { signupHandler };
