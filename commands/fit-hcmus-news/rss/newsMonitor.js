import { getLatestNews } from './getLatestNews.js';
import { ChannelType } from 'discord.js';
import schema from '../db/schema.js';

let lastSentTitle = null;

export function NewsMonitor(client) {
    setInterval(async () => {
        try {
            const news = await getLatestNews();
            if (!news || news.title === lastSentTitle) return;

            lastSentTitle = news.title;

            const configs = await schema.find({ isActive: true }).lean();

            for (const cfg of configs) {
                const guildId = cfg.guildId;
                const channelId = cfg.channelId;

                if (!guildId || !channelId) continue;

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
    }, 1000 * 60 * 10);
}