import { CustomError } from './custom-error';

export class BadRequestError extends CustomError {
	constructor(message: string) {
		super(message);
		Object.setPrototypeOf(this, BadRequestError.prototype);
	}
	statusCode = 400;

	serializeError() {
		return [{ message: this.message }];
	}
}
