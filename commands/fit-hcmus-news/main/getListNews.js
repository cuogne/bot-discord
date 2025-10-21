import { feedLinks } from "../resource/link.js";
import { crawlRssNews } from "../script/crawl-rss.js"
import { crawlHTMLNews } from "../script/crawl-html.js"

function normalizeNews(listNews) {
    const flatList = listNews.flat();
    return flatList.filter(n => n && n.title && n.url && n.category);
}

export async function getListNews() {
    try {
        const promises = feedLinks.map(feed => {
            if (feed.type === 'rss') {
                return crawlRssNews(feed.url, feed.category);
            } else if (feed.type === 'html') {
                return crawlHTMLNews(feed.url, feed.category);
            } else {
                return Promise.resolve([]);
            }
        });

        const promisesResults = await Promise.all(promises);
        const newsList = normalizeNews(promisesResults);

        // console.log(newsList);
        return newsList;

    } catch (error) {
        console.error("Error fetching news:", error);
        return [];
    }
}