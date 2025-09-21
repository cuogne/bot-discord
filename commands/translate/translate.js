export async function translateCommand(interaction) {
    await interaction.deferReply()

    const toLanguage = interaction.options.getString('to')
    let inputText = interaction.options.getString('text')

    if (inputText.length > 1000) {
        inputText = inputText.slice(0, 997) + '...'
    }

    const api = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${toLanguage}&dt=t&q=${inputText}`
    const response = await fetch(api)
    const result = await response.json()

    let translated = ''
    result[0].forEach(paragraph => {
        translated += paragraph[0];
    })

    if (translated.length > 1000) {
        translated = translated.slice(0, 997) + '...';
    }

    await interaction.editReply({
        embeds: [{
            color: 0x4285f4,
            title: '📖 Translate',
            fields: [
                { name: 'Original', value: inputText, inline: false },
                { name: 'Translated', value: translated, inline: false }
            ]
        }]
    })
}