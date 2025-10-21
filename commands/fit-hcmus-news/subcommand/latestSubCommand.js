import { feedLinks } from "../resource/link.js"
import { crawlRssNews } from "../script/crawl-rss.js";
import { crawlHTMLNews } from "../script/crawl-html.js";

export async function latestSubCommand(interaction) {
    try {
        await interaction.deferReply();

        const categoryOption = interaction.options.getString('category');

        const feed = feedLinks.find(f => f.category === categoryOption);
        const type = feed.type
        const url = feed ? feed.url : null;

        if  (type == 'rss') {
            const newsData = await crawlRssNews(url, categoryOption);
            await interaction.editReply(
                `📰 | **${newsData.title}**\n\n${newsData.url}`
            );
        } else if (type == 'html') {
            const htmlNewsData = await crawlHTMLNews(url, categoryOption);
            await interaction.editReply(
                `📰 | **${htmlNewsData.title}**\n\n${htmlNewsData.url}`
            );
        }

    } catch (error) {
        await interaction.editReply({
            content: '❌ | Failed to fetch the latest news.',
        });
        console.error(error);
    }
}