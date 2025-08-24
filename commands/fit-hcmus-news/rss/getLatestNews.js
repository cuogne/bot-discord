import { parseStringPromise } from 'xml2js';

export async function getLatestNews() {
    try {
        const link = 'https://www.fit.hcmus.edu.vn/vn/feed.aspx';
        const response = await fetch(link);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const text = await response.text();
        const result = await parseStringPromise(text);

        const latestItem = result.rss.channel[0].item[0];
        const title = latestItem.title[0];
        const link_url = latestItem.link[0];

        const newsData = {
            title,
            link: link_url,
        };

        return newsData;
    } catch (error) {
        console.error('Error fetching latest news:', error);
        throw error;
    }
}