import { CustomError } from './custom-error';

export class APIError extends CustomError {
	constructor(msg: string) {
		super(msg);

		Object.setPrototypeOf(this, APIError.prototype);
	}

	statusCode = 500;

	serializeError() {
		return [{ message: this.message }];
	}
}
