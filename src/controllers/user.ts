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
			let user = await User.findById(req.currentUser.id);
			if (user) {
				const articleData = req.body;

				let userdata = await user.populate('bookmarks').execPopulate();

				let bookmarked = false;
				let bookmarkId = null;

				for (let bookmark of userdata.bookmarks) {
					//@ts-ignore
					if (bookmark.url === articleData.url) {
						bookmarked = true;
						//@ts-ignore
						bookmarkId = bookmark._id;
					}
				}

				// const relatedArticle = await ArticleMod.findOne({
				// 	url: articleData.url,
				// });
				if (bookmarked) {
					// unbookmark

					const index = user.bookmarks.indexOf(bookmarkId);
					if (index) {
						// user.bookmarks.splice(index - 1, 1);
						//@ts-ignore
						user.bookmarks.pull(bookmarkId);
						await user.save();
						await ArticleMod.deleteOne({ id: bookmarkId });
						let userData = await user
							.populate({ path: 'bookmarks' })
							.execPopulate();
						return res.status(200).json({
							message: 'article unbookmarked successfully',
							userdata: userData,
						});
					}
				} else {
					// bookmark
					const article = ArticleMod.build(articleData);
					if (req.currentUser) {
						if (user) {
							user.bookmarks.push(article.id);
							await article.save();
							await user.save();
							let userData = await user
								.populate({ path: 'bookmarks' })
								.execPopulate();
							return res.status(201).json({
								message: 'bookmark added successfully',
								userdata: userData,
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
		let user = await User.findById(req.currentUser.id);
		let userdata = await user
			?.populate({ path: 'bookmarks' })
			.execPopulate();
		let searches = user?.savedSearches;
		let jobs: Promise<AxiosResponse<any>>[] = [];
		let headlines = Axios.get('/v2/top-headlines', {
			params: { country: user?.country },
		});
		jobs.push(headlines);
		// let x = await Promise.all(jobs);
		searches?.forEach((search) => {
			let favSearch = Axios.get('/v2/everything?language=en', {
				params: { q: search, sortBy: 'publishedAt' },
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
			if (searchResults.length <= 5) {
				data.push(...d.articles);
			} else {
				data.push(...d.articles.slice(0, 3));
			}
		});

		// perform grouping

		let bookmarks = userdata?.bookmarks;

		return res.status(200).json({ data: data, bookmarks: bookmarks });
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

export const getBookmarks = async (req: Request, res: Response) => {
	try {
		if (req.currentUser) {
			const user = await User.findById(req.currentUser.id);
			if (user) {
				let bookmarks = [];
				// let userdata = await user
				// 	.populate({ path: 'bookmarks' })
				// 	.execPopulate();
				let userdata = await user.populate('bookmarks').execPopulate();
				bookmarks = userdata.bookmarks;
				return res.status(200).json({ bookmarks: bookmarks });
			}
		}
	} catch (err) {
		console.log(err);
	}
};
