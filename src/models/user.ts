import mongoose, { Mongoose } from 'mongoose';
import { Password } from '../utils/Password';

interface UserAttrs {
	email: String;
	password: String;
}

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		minlength: 4,
	},
});

userSchema.statics.build = (attrs: UserAttrs) => {
	return new User(attrs);
};

interface UserDoc extends mongoose.Document {
	email: String;
	password: String;
}

interface UserModel extends mongoose.Model<UserDoc> {
	build(attrs: UserAttrs): UserDoc;
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

userSchema.pre('save', async function (next) {
	if (this.isModified('password')) {
		const hashed = await Password.toHash(this.get('password'));

		this.set('password', hashed);
	}
	next();
});

export { User };
