import { Request, Response } from 'express';
import Axios from 'axios';
import { News } from '../types/headLines';
import { APIError } from '../errors/api-error';
import rake from 'rake-js';

const getFrontPage = async (req: Request, res: Response) => {
	try {
		let resp = await Axios.get('/v2/top-headlines?country=in');
		let data = resp.data as News;
		// console.log(resp.data.articles[0]);

		// let articles = data.articles;

		// for (const article of data.articles) {
		// 	let tags = new Set<string>();

		// 	tags = new Set(rake(article.description, { language: 'english' }));

		// 	article.tags = tags;
		// }

		for (let i = 0; i < data.articles.length; i++) {
			let tags = new Set<string>(
				rake(
					`${data.articles[i].title} ${data.articles[i].description}`,
					{ language: 'english' }
				)
			);
			console.log(tags);
			// data.articles[i].tags = new Set<string>()
			data.articles[i].tags = Array.from(tags);
		}

		return res.send(data);
	} catch (err) {
		console.error(err);
		throw new APIError('Cannot access API');
	}
};

export { getFrontPage };
