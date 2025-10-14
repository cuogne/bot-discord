export async function getAvatarUserCommand(interaction) {
    const user = interaction.options.getUser('user') || interaction.user // lay thong tin cua nguoi can lay avt
    const avatarUrl = user.displayAvatarURL({ size: 512 }); // lay link avt

    // create embed
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
        timestamp: new Date().toISOString()
    }
    await interaction.reply({ embeds: [embed] });
}