import { Request, Response } from 'express';
import 'express-async-errors';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/Request-validation-error';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../errors/bad-request-error';
import { Password } from '../utils/Password';

const signupHandler = async (req: Request, res: Response) => {
	//code
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors.array());
		throw new RequestValidationError(errors.array());
	}
	const { email, password } = req.body;

	// we have the email and the

	const userExists = await User.findOne({ email: email });

	if (userExists) {
		console.log('user exists');
		throw new BadRequestError('Email already in use');
	}

	let newUser = User.build({ email, password });
	newUser.save();

	// return a JWT

	const payload = {
		id: newUser.id,
		email: newUser.email,
	};

	let token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1d' });

	return res.status(201).json({ message: 'new user created', token: token });
};

const signinHandler = async (req: Request, res: Response) => {
	// signin handler
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors.array());
		throw new RequestValidationError(errors.array());
	}

	const { email, password } = req.body;

	let user = await User.findOne({ email });

	if (!user) {
		console.log('user doesnot exist');
		throw new BadRequestError('User does not exist');
	}
	// user exists. compare passwords
	let correctPassword;
	try {
		console.log(user.password);
		correctPassword = await Password.compare(user.password, password);
	} catch (err) {
		console.log(err);
	}

	if (!correctPassword) {
		throw new BadRequestError('Invalid Credentials');
	}

	// generate jwt

	const payload = {
		id: user.id,
		email: user.email,
	};

	let token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1d' });
	return res.status(200).json({ user: user, token: token });
};

export { signupHandler, signinHandler };
