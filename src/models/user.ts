import mongoose, { Mongoose } from 'mongoose';
import { Password } from '../utils/Password';

interface UserAttrs {
	email: String;
	password: String;
	bookmarks?: String[];
	savedSearches?: String[];
}

const userSchema = new mongoose.Schema(
	{
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
		savedSearches: [String],
		bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
	},
	{
		toJSON: {
			transform(doc, ret, options) {
				delete ret.password;
				delete ret.__v;
			},
		},
	}
);

userSchema.statics.build = (attrs: UserAttrs) => {
	return new User(attrs);
};

userSchema.pre('save', async function (next) {
	if (this.isModified('password')) {
		const hashed = await Password.toHash(this.get('password'));

		this.set('password', hashed);
	}
	next();
});

interface UserDoc extends mongoose.Document {
	email: string;
	password: string;
	savedSearches: string[];
	bookmarks: string[];
}

interface UserModel extends mongoose.Model<UserDoc> {
	build(attrs: UserAttrs): UserDoc;
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
