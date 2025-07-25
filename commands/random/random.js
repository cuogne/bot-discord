import { shuffle } from "../../utils/shuffle.js"

export async function randomCommand(interaction) {
    const text = interaction.options.getString('text')

    const listRandom = shuffle(text.split(',').map(item => item.trim()))

    if (listRandom.length === 0) {
        await interaction.reply('Invalid')
        return;
    }

    const idx = Math.floor(Math.random() * listRandom.length)

    await interaction.reply({
        embeds: [
            {
                color: 0x4285f4,
                title: `**${listRandom[idx]}** ơi, tớ chọn cậu !`,
                image: {
                    url: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdm9lZW5uMWRzcXM4ZDg2MGgzYW9iZGxvejBkNXFjbmVsb3BzM3N5bCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/G9qfCvxlwGAaQ/giphy.gif'
                }
            }
        ]
    })
}