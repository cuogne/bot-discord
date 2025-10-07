import { loadConfig } from "./utils/loadConfig.js";
import { removeConfig } from "./utils/removeConfig.js";
import { PermissionsBitField } from 'discord.js';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';

export async function removeChannelSubCommand(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
        // Kiểm tra quyền user
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            await interaction.editReply({
                embeds: [{ title: "❌ Không có quyền", description: "Bạn cần quyền **Manage Channels** để xóa setup kênh tin tức.", color: 0xff0000 }]
            });
            return;
        }

        const guildId = interaction.guildId;
        const serverConfig = await loadConfig(guildId);

        if (!serverConfig) {
            await interaction.editReply({
                embeds: [{
                    title: "⚠️ Chưa có setup",
                    description: "Chưa setup mà remove gì ;-;",
                    color: 0xffaa00,
                }],
                ephemeral: true
            });
            return;
        }

        const channel = interaction.guild.channels.cache.get(serverConfig.channelId);
        const channelDisplay = channel ? `${channel} (#${channel.name})` : `#${serverConfig.channelName}`;

        const confirmEmbed = new EmbedBuilder()
            .setTitle("🗑️ Xác nhận xóa thiết lập kênh")
            .setDescription(`Bạn có chắc chắn muốn xóa kênh ${channelDisplay} khỏi danh sách nhận tin tức từ **FIT-HCMUS** không?`)
            .addFields(
                { name: "📍 Kênh hiện tại", value: channelDisplay, inline: true },
                { name: "🏠 Server", value: interaction.guild.name, inline: true }
            )
            .setColor(0xff9900)
            .setFooter({ text: "Hết hạn sau 30 giây" });

        // yes/no
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('remove_yes')
                    .setLabel('Yes')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('remove_no')
                    .setLabel('No')
                    .setStyle(ButtonStyle.Danger)
            );

        // Gửi embed xác nhận
        const confirmMessage = await interaction.editReply({
            embeds: [confirmEmbed],
            components: [row],
            ephemeral: true
        });

        // Tạo collector để chờ phản hồi
        const collector = confirmMessage.createMessageComponentCollector({
            filter: i => i.user.id === interaction.user.id && ['remove_yes', 'remove_no'].includes(i.customId),
            time: 30000 // 30 giây
        });

        collector.on('collect', async i => {
            await i.deferUpdate();

            if (i.customId === 'remove_no') {
                await interaction.editReply({
                    embeds: [{
                        title: "❌ Đã hủy",
                        description: "Thao tác xóa kênh tin tức đã bị hủy.",
                        color: 0xff0000
                    }],
                    components: [],
                    ephemeral: true
                });
                collector.stop('cancelled');
                return;
            }

            // yes
            const ok = await removeConfig(guildId);

            if (!ok) {
                await interaction.editReply({
                    embeds: [{
                        title: "❌ Lỗi hệ thống",
                        description: "Không thể xóa cấu hình. Vui lòng thử lại sau.",
                        color: 0xff0000
                    }],
                    components: [],
                    ephemeral: true
                });
                collector.stop('error');
                return;
            }

            await interaction.editReply({
                embeds: [{
                    title: "🗑️ Đã xóa thiết lập!",
                    description: `Kênh ${channelDisplay} đã được xóa khỏi danh sách nhận tin tức tự động.`,
                    color: 0xff9900,
                    timestamp: new Date().toISOString()
                }],
                components: [],
                ephemeral: true
            });

            if (channel) {
                try {
                    await channel.send({
                        embeds: [{
                            title: "👋 Thông báo!",
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

            collector.stop('success');
        });

        collector.on('end', async (collected, reason) => {
            if (reason === 'time') {
                await interaction.editReply({
                    embeds: [{
                        title: "⏰ Hết thời gian xác nhận",
                        description: "Thao tác xóa kênh tin tức đã bị hủy do không nhận được phản hồi.",
                        color: 0xffaa00
                    }],
                    components: [],
                    ephemeral: true
                });
            }
        });


    } catch (error) {
        console.error('❌ Error in removeChannelSubCommand:', error);
        await interaction.editReply({
            content: "❌ Có lỗi xảy ra khi xóa thiết lập kênh tin tức.",
            ephemeral: true
        });
    }
}