import { getLatestNews } from './getLatestNews.js';
import { ChannelType } from 'discord.js';
import schema from '../db/schema.js';

export function NewsMonitor(client) {
    setInterval(async () => {
        try {
            const news = await getLatestNews();
            if (!news || !news.title) return;

            const configs = await schema.find({ isActive: true }).lean();
            
            await Promise.all(configs.map(async (cfg) => {
                const guildId = cfg.guildId;
                const channelId = cfg.channelId;

                if (!guildId || !channelId) return;

                if (cfg.lastSentTitle === news.title) {
                    return;
                }

                const guild = client.guilds.cache.get(guildId);
                if (!guild) return;

                const channel = guild.channels.cache.get(channelId);
                if (!channel || channel.type !== ChannelType.GuildText) return;

                try {
                    await channel.send(`📰 | **${news.title}**\n\n${news.link}`);

                    await schema.findByIdAndUpdate(cfg._id, {
                        lastSentTitle: news.title,
                        lastSentAt: new Date()
                    });
                } catch (err) {
                    console.error(`Lỗi khi gửi tin tới kênh ${channelId} trong server ${guildId}:`, err);
                }
            }));
        } catch (error) {
            console.error('Lỗi khi lấy tin mới nhất:', error);
        }
    }, 1000 * 60 * 10);
}