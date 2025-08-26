import { getLatestNews } from '../rss/getLatestNews.js';

export async function latestSubCommand(interaction) {
    try {
        await interaction.deferReply();

        const news = await getLatestNews();
        await interaction.editReply({
            content: `📰 | **${news.title}**\n\n${news.link}`,
        });
    } catch (error) {
        await interaction.editReply({
            content: '❌ | Failed to fetch the latest news.',
        });
        console.error(error);
    }
}