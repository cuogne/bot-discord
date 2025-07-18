export async function getAvatarCommand(interaction) {
    const user = interaction.options.getUser('user') || interaction.user // lay thong tin cua nguoi can lay avt
    const avatarUrl = user.displayAvatarURL({ size: 512, dynamic: true }); // lay link avt

    // creaate embed
    const embed = {
        color: 0x0099ff,
        title: `${interaction.user.username} muốn xem ảnh của ${user.username}`,
        image: {
            url: avatarUrl
        },
        footer: {
            text: `Requested by ${interaction.user.username}`,
            icon_url: interaction.user.displayAvatarURL()
        },
        timestamp: new Date()
    }
    await interaction.reply({ embeds: [embed] });
}