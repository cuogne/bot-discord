export async function translateCommand(interaction) {
    await interaction.deferReply()

    const toLanguage = interaction.options.getString('to')
    const text = interaction.options.getString('text')

    const api = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${toLanguage}&dt=t&q=${text}`
    const reponse = await fetch(api)
    const result = await reponse.json()

    const translated = result[0][0][0]

    // await interaction.editReply(`**${text}**: ${translated}`)

    await interaction.editReply({
        embeds: [{
            color: 0x4285f4,
            title: '📖 Translate',
            fields: [
                { name: 'Original', value: text, inline: false },
                { name: 'Translated', value: translated, inline: false }
            ]
        }]
    })
}