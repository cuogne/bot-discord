import axios from 'axios'
import * as cheerio from 'cheerio'
import { ChatInputCommandInteraction } from 'discord.js';

export async function diemthptqgCommand(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply(); // timeout 3s cho bot
    const sbdText = interaction.options.getString('text') // lay sbd tu user nhap vao

    if (!sbdText) {
        await interaction.editReply({
            content: 'Vui lòng nhập số báo danh',
        });
        return
    }

    const url = `https://diemthi.vnexpress.net/index/detail/sbd/${sbdText}/year/2025`;

    try {
        const response = await axios.get(url)
        const html= response.data as string;
        const $ = cheerio.load(html)

        const sbd = sbdText;

        const diem = $('tbody').first().text()
            .trim()
            .replace(/\t/g, ' ')
            .replace(/\n/g, ' ')
            .replace(/  +/g, ' ')

        if (!diem || diem.length === 0) {
            await interaction.editReply({
                content: 'Không tìm thấy điểm thi cho số báo danh này',
            })
            return
        }

        // console.log(`${sbd}: ${diem}`)
        const matches = [...diem.matchAll(/([A-Za-zÀ-ỹ\s]+)\s(\d+(?:\.\d+)?)/g)];
        const result = matches.map(match => {
            let subject = match[1].replace(/[\u0300-\u036f]/g, "").trim()
            let score = match[2];
            return `**${subject}**: ${score}`;
        }).join('\n');

        // console.log(result);

        await interaction.editReply({
            embeds: [{
                color: 0x4285f4,
                title: '🎓 Điểm thi THPTQG 2025',
                description: `📋 **Số báo danh:** \`${sbd}\``,
                fields: [
                    {
                        name: '📊 Kết quả thi',
                        value: result || 'Không có dữ liệu',
                        inline: false
                    }
                ],
                footer: {
                    text: 'Chương trình 2018'
                },
                timestamp: new Date().toISOString()
            }]
        })

    } catch (error) {
        console.error('Lỗi khi crawl dữ liệu:', error)

        await interaction.editReply({
            content: 'Có lỗi xảy ra khi crawl dữ liệu',
        });
    }
}