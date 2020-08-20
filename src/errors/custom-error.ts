export abstract class CustomError extends Error {
	abstract statusCode: number;
	abstract serializeError(): { message: string; field?: string }[];

	constructor(message: string) {
		console.log(message);
		super(message);
		Object.setPrototypeOf(this, CustomError.prototype);
	}
}
