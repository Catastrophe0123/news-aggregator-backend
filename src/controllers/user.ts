import { Request, Response } from 'express';
// import { Article } from '../types/headLines';
import { ArticleMod, articleAttrs } from '../models/article';
import { User } from '../models/user';

export const postBookmark = async (req: Request, res: Response) => {
	// code

	try {
		if (req.currentUser) {
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
