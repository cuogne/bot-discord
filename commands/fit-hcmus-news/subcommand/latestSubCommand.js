import { getLatestNews } from '../rss/getLatestNews.js';

export async function latestSubCommand(interaction) {
    try {
        const news = await getLatestNews();
        await interaction.reply({
            content: `📰 | **${news.title}**\n\n${news.link}`,
        });
    } catch (error) {
        await interaction.reply({
            content: '❌ | Failed to fetch the latest news.',
            ephemeral: true,
        });
        console.error(error);
    }
}