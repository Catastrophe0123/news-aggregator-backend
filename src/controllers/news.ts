import { Request, Response } from 'express';
import Axios from 'axios';
import { News } from '../types/headLines';
import { APIError } from '../errors/api-error';
// import rake from 'rake-js';

import retext from 'retext';
import vfile from 'vfile';
import pos from 'retext-pos';
import k from 'retext-keywords';
import tostring from 'nlcst-to-string';

const getFrontPage = async (req: Request, res: Response) => {
	try {
		let resp = await Axios.get('/v2/top-headlines?country=in');
		let data = resp.data as News;

		// RAKE ALG IMPLEMENTATION
		// for (let i = 0; i < data.articles.length; i++) {
		// 	let tags = new Set<string>(
		// 		rake(
		// 			`${data.articles[i].title} ${data.articles[i].description}`,
		// 			{ language: 'english' }
		// 		)
		// 	);
		// 	console.log(tags);
		// 	// data.articles[i].tags = new Set<string>()
		// 	data.articles[i].tags = Array.from(tags);
		// }

		// RETEXT IMPLEMENTATION
		for (let i = 0; i < data.articles.length; i++) {
			data.articles[i].tags = [];
			retext()
				.use(pos)
				.use(k)
				.process(
					`${data.articles[i].title} ${data.articles[i].description}`,
					(err: Error, file: any) => {
						if (err) throw err;
						console.log('Keywords:');
						file.data.keywords.forEach(function (key: any) {
							console.log(tostring(key.matches[0].node));
						});
						console.log();
						console.log('Key-phrases:');
						file.data.keyphrases.forEach(function (phrase: any) {
							console.log(
								phrase.matches[0].nodes.map(stringify).join('')
							);
							data.articles[i].tags!.push(
								phrase.matches[0].nodes.map(stringify).join('')
							);
							function stringify(value: any) {
								return tostring(value);
							}
						});
					}
				);
		}

		return res.send(data);
	} catch (err) {
		console.error(err);
		throw new APIError('Cannot access API');
	}
};

export { getFrontPage };
