import { feedLinks } from "../resource/link.js";
import { crawlRssNews } from "../script/crawl-rss.js"
import { crawlHTMLNews } from "../script/crawl-html.js"

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

        const newsList = await Promise.all(promises);

        return newsList;

    } catch (error) {
        console.error("Error fetching news:", error);
        return [];
    }
}