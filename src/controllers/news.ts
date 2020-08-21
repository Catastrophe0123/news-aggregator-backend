import { Request, Response } from 'express';
import Axios from 'axios';
import { News } from '../types/headLines';
import { APIError } from '../errors/api-error';

const getFrontPage = async (req: Request, res: Response) => {
	try {
		let resp = await Axios.get('/v2/top-headlines?language=en');
		console.log(resp.data.articles.length);
		let x = resp.data as News;
		console.log(resp.data.articles[0]);
		return res.send(resp.data);
	} catch (err) {
		console.error(err);
		throw new APIError('Cannot access API');
	}
};

export { getFrontPage };
