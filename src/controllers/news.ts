import { Request, Response, query } from 'express';
import Axios from 'axios';
import { News, Source, Sources } from '../types/headLines';
import { APIError } from '../errors/api-error';
// import rake from 'rake-js';

import retext from 'retext';
import vfile from 'vfile';
import pos from 'retext-pos';
import k from 'retext-keywords';
import tostring from 'nlcst-to-string';

const getTagsWithRetext = (data: News) => {
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
	return data;
};

const getFrontPage = async (req: Request, res: Response) => {
	try {
		let resp = await Axios.get('/v2/top-headlines?country=in', {
			...req.query,
		});
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
		data = getTagsWithRetext(data);

		return res.send(data);
	} catch (err) {
		console.error(err);
		throw new APIError('Cannot access API');
	}
};

const getSearch = async (req: Request, res: Response) => {
	let queries = req.query;
	console.log('queries : ', queries);
	try {
		let resp = await Axios.get('/v2/everything?language=en', {
			params: {
				...queries,
			},
		});
		let data = resp.data as News;
		data = getTagsWithRetext(data);
		if (queries.sources) {
			let source = queries.sources as string;
			const sourceData = await getSources(source);
			if (sourceData) {
				data.sourceData = sourceData;
			}
		}
		return res.send(data);
	} catch (err) {
		console.error(err);
		throw new APIError('Cannot access API');
	}
};

const getSources = async (querySource: string) => {
	//
	try {
		let resp = await Axios.get('/v2/sources');
		let data = resp.data as Sources;
		let source: Source | undefined;
		source = data.sources.find((src) => src.id === querySource);
		return source;
	} catch (err) {
		console.log(err);
		throw new APIError('Cannot access API');
	}
};

export { getFrontPage, getSearch };
