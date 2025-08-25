import { loadConfig } from './utils/loadConfig.js';
import { saveConfig } from './utils/saveConfig.js';
import { ChannelType, PermissionsBitField } from 'discord.js';

export async function setupChannelSubCommand(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const selectedChannel = interaction.options.getChannel('channel');  // lay kenh tu option
    const targetChannel = selectedChannel || interaction.channel;       // lay kenh hien tai

    // Kiểm tra quyền của user gọi lệnh
    if (!interaction.memberPermissions.has(PermissionsBitField.Flags.ManageChannels)) {
        await interaction.editReply({
            embeds: [{
                title: "❌ Không có quyền",
                description: "Bạn cần quyền **Manage Channels** để thiết lập kênh tin tức.",
                color: 0xff0000
            }],
            ephemeral: true
        });
        return;
    }

    // Kiểm tra loại kênh
    if (targetChannel.type !== ChannelType.GuildText) {
        await interaction.editReply({
            embeds: [{
                title: "❌ Loại kênh không hợp lệ",
                description: "Chỉ có thể thiết lập tin tức cho **text channel**.",
                color: 0xff0000
            }],
            ephemeral: true
        });
        return;
    }

    // Kiểm tra quyền bot trong kênh
    const botPermissions = targetChannel.permissionsFor(interaction.client.user.id);

    if (!botPermissions || !botPermissions.has([
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.EmbedLinks
    ])) {
        await interaction.editReply({
            embeds: [{
                title: "❌ Bot không có quyền",
                description: `Bot cần quyền **Send Messages** và **Embed Links** trong kênh ${targetChannel}.`,
                color: 0xff0000
            }],
            ephemeral: true
        });
        return;
    }

    const config = loadConfig();

    // check coi server nay da co channel setup chua
    const guildId = interaction.guildId;
    const existingChannel = config.servers[guildId];

    if (existingChannel && existingChannel.channelId === targetChannel.id) {
        await interaction.editReply({
            embeds: [{
                title: "⚠️ Kênh đã được Setup",
                description: `Kênh ${targetChannel} đã được setup để nhận tin tức từ trước.`,
                color: 0xffaa00,
                fields: [
                    {
                        name: "📅 Setup lúc",
                        value: `<t:${Math.floor(new Date(existingChannel.setupAt).getTime() / 1000)}:R>`,
                        inline: true
                    },
                    {
                        name: "👤 Setup bởi",
                        value: `<@${existingChannel.setupBy}>`,
                        inline: true
                    }
                ]
            }],
            ephemeral: true
        });
        return;
    }

    // Lưu config mới
    config.servers[guildId] = {
        channelId: targetChannel.id,
        channelName: targetChannel.name,
        guildName: interaction.guild.name,
        setupBy: interaction.user.id,
        setupAt: new Date().toISOString(),
        isActive: true
    };

    const saved = saveConfig(config);

    if (!saved) {
        await interaction.editReply({
            embeds: [{
                title: "❌ Lỗi hệ thống",
                description: "Không thể lưu cấu hình. Vui lòng thử lại sau.",
                color: 0xff0000
            }]
        });
        return;
    }

    // Thông báo thành công
    await interaction.editReply({
        embeds: [{
            title: "✅ Thiết lập thành công!",
            description: `Kênh ${targetChannel} đã được thiết lập để nhận tin tức tự động từ **FIT-HCMUS**.`,
            color: 0x00ff00,
            fields: [
                {
                    name: "📍 Kênh được chọn",
                    value: `${targetChannel} (#${targetChannel.name})`,
                    inline: true
                },
                {
                    name: "🏠 Server",
                    value: interaction.guild.name,
                    inline: true
                },
                {
                    name: "👤 Setup bởi",
                    value: `${interaction.user}`,
                    inline: true
                }
            ]
        }],
        ephemeral: true
    });

    try {
        await targetChannel.send({
            embeds: [{
                title: "🎉 FIT-HCMUS News!",
                description: "Kênh này đã được thiết lập để nhận tin tức tự động từ **Khoa Công nghệ Thông tin - FIT@HCMUS**.\n\n Nếu bạn không muốn nhận thông báo nữa, vui lòng dùng lệnh: \n`/fit-hcmus-news remove`.",
                color: 0x0099ff,
                timestamp: new Date().toISOString()
            }]
        });
    } catch (error) {
        console.error('❌ Không thể gửi tin thử:', error);
    }
}