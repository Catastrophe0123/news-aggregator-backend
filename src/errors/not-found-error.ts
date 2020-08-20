import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
	constructor(message: string) {
		super(message);
		Object.setPrototypeOf(this, NotFoundError.prototype);
	}

	statusCode = 400;

	serializeError() {
		return [{ message: 'Route does not exists' }];
	}
}
