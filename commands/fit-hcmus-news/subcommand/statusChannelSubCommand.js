import { loadConfig } from "./utils/loadConfig.js";

export async function statusChannelSubCommand(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
        const guildId = interaction.guildId;
        const serverConfig = await loadConfig(guildId);

        if (!serverConfig) {
            await interaction.editReply({
                embeds: [{
                    title: "Status FIT-HCMUS News!",
                    description: "Server này chưa thiết lập nhận tin tức từ FIT.",
                    color: 0x999999,
                    fields: [
                        {
                            name: "💡 Hướng dẫn",
                            value: "Sử dụng `/fit-hcmus-news setup` để chọn kênh nhận tin tức.",
                            inline: false
                        }
                    ]
                }],
                ephemeral: true
            });
            return;
        }

        const channel = interaction.guild.channels.cache.get(serverConfig.channelId);

        await interaction.editReply({
            embeds: [{
                title: "Status FIT-HCMUS News!",
                description: ``,
                color: 0x00ff00,
                fields: [
                    {
                        name: "📍 Kênh được chọn nhận thông báo",
                        value: channel ? `${channel} (#${channel.name})` : `#${serverConfig.channelName} *(có thể đã bị xóa)*`,
                        inline: false
                    },
                    {
                        name: "👤 Setup bởi",
                        value: `<@${serverConfig.setupBy}>`,
                        inline: false
                    },
                    {
                        name: "🟢 Trạng thái",
                        value: serverConfig.isActive !== false ? "Đang hoạt động" : "Đã tạm dừng",
                        inline: false
                    }
                ]
            }],
            ephemeral: true
        });

    } catch (error) {
        console.error('❌ Error in statusChannelSubCommand:', error);
        await interaction.editReply({
            content: "❌ Có lỗi xảy ra khi đọc thông tin cấu hình.",
            ephemeral: true
        });
    }
}