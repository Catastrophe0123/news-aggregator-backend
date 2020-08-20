import { CustomError } from './custom-error';
import { ValidationError } from 'express-validator';

export class RequestValidationError extends CustomError {
	constructor(private errors: ValidationError[]) {
		super('Invalid request params');
		Object.setPrototypeOf(this, RequestValidationError.prototype);
	}

	statusCode = 400;

	serializeError() {
		return this.errors.map((err) => {
			return { message: err.msg, field: err.param };
		});
	}
}
