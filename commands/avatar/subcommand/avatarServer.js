export async function getAvatarServerCommand(interaction) {
    const guild = interaction.guildId;

    if (!guild) {
        await interaction.reply({
            content: "Lệnh này chỉ dùng trong server thôi nhé!",
            ephemeral: true
        });
        return;
    }

    const imgServer = interaction.guild?.iconURL({ size: 512 });

    if (!imgServer) {
        await interaction.reply("Server này chưa có ảnh!");
        return;
    }

    const embed = {
        color: 0x0099ff,
        title: `${interaction.user.username} muốn xem ảnh của server ${interaction.guild?.name}`,
        image: {
            url: imgServer
        },
        footer: {
            text: `Requested by ${interaction.user.username}`,
            icon_url: interaction.user.displayAvatarURL()
        },
        timestamp: new Date().toISOString()
    }

    await interaction.reply({ embeds: [embed] });
}