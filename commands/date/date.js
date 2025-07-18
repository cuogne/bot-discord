export async function dateCommand(interaction) {
    const nowDate = new Date();
    const dateStr = nowDate.toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh'
    });

    await interaction.reply(`${dateStr}`);
}