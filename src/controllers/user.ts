import { Request, Response } from 'express';
// import { Article } from '../types/headLines';
import { ArticleMod, articleAttrs } from '../models/article';
import { User } from '../models/user';
import Axios, { AxiosResponse } from 'axios';
import { News, Article } from '../types/headLines';
import { getTagsWithRetext } from './news';

export const postBookmark = async (req: Request, res: Response) => {
	// code

	try {
		if (req.currentUser) {
			console.log('in post bookmarks');
			let user = await User.findById(req.currentUser.id);
			if (user) {
				const articleData = req.body;

				const relatedArticle = await ArticleMod.findOne({
					url: articleData.url,
				});
				if (relatedArticle) {
					// unbookmark
					console.log('here');
					const index = user.bookmarks.indexOf(relatedArticle.id);
					if (index) {
						console.log('here');
						user.bookmarks.splice(index, 1);
						await user.save();
						await relatedArticle.deleteOne();
						let userdata = await user
							.populate('bookmarks')
							.execPopulate();
						return res.status(200).json({
							message: 'article unbookmarked successfully',
							userdata: userdata,
						});
					}
				} else {
					// bookmark
					console.log('in bookmark');
					const article = ArticleMod.build(articleData);
					if (req.currentUser) {
						if (user) {
							user.bookmarks.push(article.id);
							await article.save();
							await user.save();
							let userdata = await user
								.populate({ path: 'bookmarks' })
								.execPopulate();
							return res.status(201).json({
								message: 'bookmark added successfully',
								userdata: userdata,
							});
						}
					}
				}
			}
		}
	} catch (err) {
		console.log(err);
	}
};

export const postSaveSearch = async (req: Request, res: Response) => {
	// save searches

	try {
		if (req.currentUser) {
			console.log('boyboy');
			let user = await User.findById(req.currentUser.id);
			if (user) {
				let { searchString } = req.body;

				if (user.savedSearches.includes(searchString)) {
					// remove the search thing
					user.savedSearches.splice(
						user.savedSearches.indexOf(searchString),
						1
					);
					await user.save();
					let userData = await user
						.populate('bookmarks')
						.execPopulate();
					return res.status(200).json({
						message: 'save removed successfully',
						userData,
					});
				} else {
					// save to search array
					user.savedSearches.push(searchString);
					await user.save();
					let userData = await user
						.populate('bookmarks')
						.execPopulate();
					return res
						.status(201)
						.json({ message: 'saved successfully', userData });
				}
			}
		}
	} catch (err) {
		console.log(err);
	}
};

export const getSavedSearches = async (req: Request, res: Response) => {
	// code

	if (req.currentUser) {
		let user = await User.findById(req.currentUser.id);
		return res.status(200).json({ savedSearches: user?.savedSearches });
	}
};

export const getPersonalizedNews = async (req: Request, res: Response) => {
	//code
	if (req.currentUser) {
		console.log('hola');
		let user = await User.findById(req.currentUser.id);
		let searches = user?.savedSearches;
		let jobs: Promise<AxiosResponse<any>>[] = [];
us		let headlines = Axios.get('/v2/top-headlines', {
			params: { country: user?.country },
		});
		jobs.push(headlines);
		// let x = await Promise.all(jobs);
		searches?.forEach((search) => {
			let favSearch = Axios.get('/v2/everything?language=en', {
				params: { q: search },
			});
			jobs.push(favSearch);
			// searches
			// topics followed
		});

		let data: Article[] = [];

		let searchResults = await Promise.all(jobs);
		searchResults.forEach(async (el) => {
			let d = el.data as News;
			d = getTagsWithRetext(d);
			data.push(...d.articles.slice(0, 3));
		});

		// perform grouping

		return res.status(200).json({ data: data });
	}
};

export const postUser = async (req: Request, res: Response) => {
	try {
		if (req.currentUser) {
			let user = await User.findById(req.currentUser.id);
			if (user) {
				user.country = req.body.country;
				user.layout = req.body.layout;
				user = await user.save();
				return res.status(200).json({ userData: user });
			}
		}
	} catch (err) {
		console.log(err);
		return res.status(400).json({ error: 'error occurred' });
	}
};

export const postCountry = async (req: Request, res: Response) => {
	try {
		const { lat, lon } = req.body;

		const resp = await Axios.get(
			'https://nominatim.openstreetmap.org/reverse',
			{ params: { format: 'json', lat, lon } }
		);

		let country = resp.data.address.country_code;
		console.log('heereoroiasnd  :A : :A : : ', country);
		if (req.currentUser) {
			const user = await User.findById(req.currentUser.id);

			if (user) {
				user.country = country;
				await user.save();
				return res
					.status(200)
					.json({ message: 'country saved', country: user.country });
			}
		}
	} catch (err) {
		console.log(err);
	}
};
