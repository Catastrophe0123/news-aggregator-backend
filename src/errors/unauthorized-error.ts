import { CustomError } from './custom-error';

export class UnauthorizedError extends CustomError {
	constructor(err: string) {
		super(err);
		Object.setPrototypeOf(this, UnauthorizedError.prototype);
	}

	statusCode = 401;

	serializeError() {
		return [{ message: 'Not Authorized' }];
	}
}
