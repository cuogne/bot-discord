import { loadConfig } from "./utils/loadConfig.js";
import { saveConfig } from "./utils/saveConfig.js";
import { PermissionsBitField } from 'discord.js';

export async function removeChannelSubCommand(interaction) {
    await interaction.deferReply();

    try {
        // Kiểm tra quyền user
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            await interaction.editReply({
                embeds: [{
                    title: "❌ Không có quyền",
                    description: "Bạn cần quyền **Manage Channels** để xóa setup kênh tin tức.",
                    color: 0xff0000,
                }]
            });
            return;
        }

        const config = loadConfig();
        const guildId = interaction.guildId;
        const serverConfig = config.servers[guildId];

        if (!serverConfig) {
            await interaction.editReply({
                embeds: [{
                    title: "⚠️ Chưa có setup",
                    description: "Chưa setup mà remove gì ;-;",
                    color: 0xffaa00,
                }]
            });
            return;
        }

        const channel = interaction.guild.channels.cache.get(serverConfig.channelId);
        const channelDisplay = channel ? `${channel} (#${channel.name})` : `#${serverConfig.channelName}`;

        delete config.servers[guildId]; // xóa khỏi config
        const saved = saveConfig(config);

        if (!saved) {
            await interaction.editReply({
                embeds: [{
                    title: "❌ Lỗi hệ thống",
                    description: "Không thể xóa cấu hình. Vui lòng thử lại sau.",
                    color: 0xff0000
                }]
            });
            return;
        }

        await interaction.editReply({
            embeds: [{
                title: "🗑️ Đã xóa thiết lập!",
                description: `Kênh ${channelDisplay} đã được xóa khỏi danh sách nhận tin tức tự động.`,
                color: 0xff9900,
                timestamp: new Date().toISOString()
            }]
        });

        if (channel) {
            try {
                await channel.send({
                    embeds: [{
                        title: "👋 Tạm biệt!",
                        description: "Kênh này đã được xóa khỏi danh sách nhận tin tức tự động từ **FIT-HCMUS**.",
                        color: 0xff9900,
                        fields: [
                            {
                                name: "💡 Muốn nhận tin tức trở lại?",
                                value: "Sử dụng `/fit-hcmus-news setup` để thiết lập lại.",
                                inline: false
                            }
                        ],
                        timestamp: new Date().toISOString()
                    }]
                });
            } catch (error) {
                console.error('❌ Không thể gửi thông báo tạm biệt:', error);
            }
        }

    } catch (error) {
        console.error('❌ Error in removeChannelSubCommand:', error);
        await interaction.editReply({
            content: "❌ Có lỗi xảy ra khi xóa thiết lập kênh tin tức.",
            ephemeral: true
        });
    }
}