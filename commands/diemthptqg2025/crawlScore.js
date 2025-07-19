import axios from 'axios'
import * as cheerio from 'cheerio'

export async function lookUpSBDCommand(interaction) {
    await interaction.deferReply(); // timeout 3s cho bot
    const sbdText = interaction.options.getString('text') // lay sbd tu user nhap vao

    if (sbdText.length !== 8) {
        const errMsg = 'Số báo danh phải đủ 8 chữ số'
        await interaction.editReply({
            content: errMsg,
            flags: 64
        });
        return
    }

    const url = `https://diemthi.vnexpress.net/index/detail/sbd/${sbdText}/year/2025`;

    try {
        const response = await axios.get(url)
        const html = response.data
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
                flags: 64
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
                title: 'Điểm thi THPTQG 2025 - Chương trình 2018',
                description: `**SBD:** ${sbd}\n**Điểm thi:**
                ${result}`
            }]
        })

    } catch (error) {
        console.error('Lỗi khi crawl dữ liệu:', error)

        await interaction.editReply({
            content: 'Có lỗi xảy ra khi crawl dữ liệu',
            flags: 64
        });
    }
}
