import mongoose from 'mongoose';
// import { Source } from '../types/headLines';

const sourceSchema = new mongoose.Schema({ id: String, name: String });

interface SourceAttrs {
	id: String;
	name: String;
}

interface articleAttrs {
	source: SourceAttrs;
	author: String;
	title: String;
	description: String;
	url: String;
	urlToImage: String;
	publishedAt: Date;
	content: String;
}

const articleSchema = new mongoose.Schema({
	source: sourceSchema,
	author: String,
	title: String,
	description: String,
	url: String,
	urlToImage: String,
	publishedAt: Date,
	content: String,
});

articleSchema.statics.build = (attrs: articleAttrs) => {
	return new ArticleMod(attrs);
};

interface ArticleDoc extends mongoose.Document {
	source: { id: string; name: string };
	author: string;
	title: string;
	description: string;
	url: string;
	urlToImage: string;
	publishedAt: Date;
	content: string;
}

interface ArticleModel extends mongoose.Model<ArticleDoc> {
	build(attrs: articleAttrs): ArticleDoc;
}

const ArticleMod = mongoose.model<ArticleDoc, ArticleModel>(
	'Article',
	articleSchema
);

export { ArticleMod, articleAttrs };
