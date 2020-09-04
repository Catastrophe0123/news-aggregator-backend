import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import Axios from 'axios';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import cors from 'cors';

// load process.env
import { config } from 'dotenv';
config();

const PORT = process.env.PORT || 4000;
const app = express();
app.use(cors());
app.use(json());

// local imports
import { getFrontPage, getSearch } from './controllers/news';
import { signupHandler, signinHandler } from './controllers/authentication';
import { DatabaseConnectionError } from './errors/database-connection-error';
import { NotFoundError } from './errors/not-found-error';
import { errorHandler } from './middlewares/error-handler';
import { isAuth } from './middlewares/isAuth';
import { postBookmark, postSaveSearch } from './controllers/user';

// axios config
Axios.defaults.headers.common['Authorization'] = process.env.NEWS_API;
Axios.defaults.baseURL = 'https://newsapi.org';

app.get('/headlines', getFrontPage);
app.post(
	'/signup',
	[
		body('email').isEmail().withMessage('email must be valid'),
		body('password')
			.trim()
			.isLength({ max: 20, min: 4 })
			.withMessage('password must be atleast 4 letters long'),
	],
	signupHandler
);

app.post(
	'/login',
	[
		body('email').isEmail().withMessage('email must be valid'),
		body('password')
			.trim()
			.isLength({ max: 20, min: 4 })
			.withMessage('password must be atleast 4 letters long'),
	],
	signinHandler
);

app.post('/bookmark', [isAuth], postBookmark);

app.get('/search', getSearch);

app.post('/search/save', [isAuth], postSaveSearch);

app.all('*', async () => {
	throw new NotFoundError('Route not found');
});

app.use(errorHandler);

const main = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI!, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		console.log('connected to mongodb');
	} catch (err) {
		console.log('im running');
		console.log(err);
		throw new DatabaseConnectionError('could not connect to database');
	}
	app.listen(PORT, () => {
		console.log('server up');
	});
};

main();
