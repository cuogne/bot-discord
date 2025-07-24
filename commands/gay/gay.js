export async function gayCommand(interaction) {
    await interaction.deferReply();
    const user = interaction.options.getString('user');

    const msgReply = `
🏳️‍🌈 Lòng ${user} tan nát khi nhận ra ${user} là gay 🌈,
💔 Đời có hiểu cho hay sẽ mỉa mai tình ${user} 😘,
🧑‍🤝‍🧑 Đàn ông cớ sao lại đi yêu người đàn ông ❤️‍🔥,
😢 Sao trời cao nỡ cợt đùa như thế 😭.
🌟 Khi ${user} cũng muốn làm làm 1 người đàn ông. 😿`;

    await interaction.editReply(msgReply);
}