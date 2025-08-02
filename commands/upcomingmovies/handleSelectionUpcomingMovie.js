import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { formatDayVN } from './formatDayVN.js';

export async function handleUpcomingMovieSelection(interaction) {
    await interaction.deferReply();
    const idx = interaction.values[0] // index of upcoming movie

    try {
        const response = await fetch('https://cinestar.com.vn/_next/data/jZniZUx-s1ODigQHrqyik/index.json');
        const data = await response.json();
        const selectedMovie = data.pageProps.res.listComingMovie[idx];

        if (!selectedMovie) {
            await interaction.editReply('Không tìm thấy phim được chọn.');
            return;
        }

        // create button
        let buttonTrailer;
        if (selectedMovie.trailer) {
            buttonTrailer = new ButtonBuilder()
                .setLabel('🔗 Xem trailer')
                .setStyle(ButtonStyle.Link)
                .setURL(`https://youtu.be/${selectedMovie.trailer}`);
        }

        let components = [];
        if (buttonTrailer) {
            const actionRow = new ActionRowBuilder().addComponents(buttonTrailer);
            components = [actionRow];
        }

        await interaction.editReply({
            embeds: [{
                color: 0x4285f4,
                title: `🎬 ${selectedMovie.name_vn}`,
                description: `
**📅 Ngày khởi chiếu:** ${formatDayVN(selectedMovie.release_date.split(' ')[0])}
**⏳ Thời lượng:** ${selectedMovie.time} phút
**🎭 Thể loại:** ${selectedMovie.type_name_vn}

**📒 Giới thiệu phim:**
${selectedMovie.brief_vn.split('. ').join('.\n')}`,

                thumbnail: {
                    url: selectedMovie.image
                },
                footer: {
                    text: 'Cinestar'
                },
                timestamp: new Date().toISOString()
            }],
            components
        });

    } catch (error) {
        await interaction.editReply('Đã xảy ra lỗi khi lấy thông tin phim sắp chiếu.');
    }
}