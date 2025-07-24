export async function randomCommand(interaction) {
    const text = interaction.options.getString('text')

    const listRandom = text.split(',').map(item => item.trim())

    if (listRandom.length === 0) {
        await interaction.reply('Invalid')
    }

    const idx = Math.floor(Math.random() * listRandom.length)

    await interaction.reply(listRandom[idx])
}