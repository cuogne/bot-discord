import { shuffle } from "../../utils/shuffle";
import { ChatInputCommandInteraction } from "discord.js";

export async function randomCommand(interaction: ChatInputCommandInteraction){
    await interaction.deferReply();
    const text = interaction.options.getString('text');

    if (!text){
        await interaction.reply('Có lỗi xảy ra, vui lòng nhập lại');
        return;
    }

    const listRandom: string[] = shuffle(text.split(',').map(item => item.trim()));

    if (listRandom.length === 0) {
        await interaction.reply('Invalid')
        return;
    }

    const idx = Math.floor(Math.random() * listRandom.length);
    const linkMeme = 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdm9lZW5uMWRzcXM4ZDg2MGgzYW9iZGxvejBkNXFjbmVsb3BzM3N5bCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/G9qfCvxlwGAaQ/giphy.gif';

    await interaction.editReply({
        embeds: [
            {
                color: 0x4285f4,
                title: `**${listRandom[idx]}** ơi, tớ chọn cậu !`,
                image: {
                    url: linkMeme
                }
            }
        ]
    })
}