export interface News {
	status: string;
	totalResults: string;
	articles: Article[];
}

export interface Article {
	source: Source;
	author: null;
	title: string;
	description: string;
	url: string;
	urlToImage: string;
	publishedAt: Date;
	content: string;
	tags: null | string[] | Set<string>;
}

export interface Source {
	id: string;
	name: string;
}

// {
//     "status": "ok",
// "totalResults": "38",
// "articles": [
//     { "source": { "id": "financial-times", "name": "Financial Times" },
//   "author": null,
//   "title":
//    "The battle for Wisconsin: Biden tries to avoid mistakes of 2016",
//   "description":
//    "Swing state was decisive in Trump’s win and Democrats are determined ‘not to go down that road again’",
//   "url":
//    "https://www.ft.com/content/feb4746d-a513-4d7c-9b44-2143127e5508",
//   "urlToImage":
//    "https://www.ft.com/__origami/service/image/v2/images/raw/https%3A%2F%2Fd1e00ek4ebabms.cloudfront.net%2Fproduction%2Fef574ca3-b7e3-455a-aecd-cb22bf5bca2a.jpg?source=next-opengraph&fit=scale-down&width=900",
//   "publishedAt": "2020-08-20T13:37:33.1077515Z",
//   "content":
//    "In an alternate world where coronavirus had not forced the Democrats to hold a virtual convention, Joe Biden on Thursday would have accepted his party’s presidential nomination in the critical swing … [+5843 chars]" }
//     ]
// }
