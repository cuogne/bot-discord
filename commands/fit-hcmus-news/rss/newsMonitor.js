import { getLatestNews } from './getLatestNews.js';
import { loadConfig } from '../subcommand/utils/loadConfig.js';
import { ChannelType } from 'discord.js';

let lastSentTitle = null;

export function NewsMonitor(client) {
    setInterval(async () => {
        try {
            const news = await getLatestNews();
            if (!news || news.title === lastSentTitle) return;

            lastSentTitle = news.title;

            const config = loadConfig();
            if (!config.servers) return;

            for (const guildId in config.servers) {
                const serverConfig = config.servers[guildId];
                const channelId = serverConfig.channelId;
                if (!channelId) continue;

                const guild = client.guilds.cache.get(guildId);
                if (!guild) continue;

                const channel = guild.channels.cache.get(channelId);
                if (!channel || channel.type !== ChannelType.GuildText) continue;

                try {
                    await channel.send(`📰 | **${news.title}**\n\n${news.link}`);
                } catch (err) {
                    console.error(`Lỗi khi gửi tin tới kênh ${channelId} trong server ${guildId}:`, err);
                }
            }
        } catch (error) {
            console.error('Lỗi khi lấy tin mới nhất:', error);
        }
    }, 1000 * 60 * 30);
}