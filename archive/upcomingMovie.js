import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

function formatDayVN(date) {
    const [month, day, year] = date.split('/')
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
}

// using button prev and next

export async function upcomingMoviesCommand(interaction) {
    await interaction.deferReply();

    const api = 'https://cinestar.com.vn/_next/data/jZniZUx-s1ODigQHrqyik/index.json'

    try {
        const response = await fetch(api);
        const data = await response.json();

        const movies = data.pageProps.res.listComingMovie;
        let currentPage = 0;
        const totalPages = movies.length;

        function getEmbed(page) {
            const movie = movies[page];
            const nameMovie = movie.name_vn;
            const releaseDate = formatDayVN(movie.release_date.split(' ')[0]);
            const linkTrailer = movie.trailer ? `[Trailer](<https://youtu.be/${movie.trailer}>)` : '';
            const minute = movie.time;
            return {
                title: `🎬 ${nameMovie}`,
                color: 0x0099ff,
                description: `**Ngày khởi chiếu:** ${releaseDate}\n**Thời lượng:** ${minute} phút${linkTrailer ? `\n${linkTrailer}` : ''}`,
                thumbnail: { url: movie.image },
                footer: {
                    text: `Trang ${page + 1}/${totalPages}`
                }
            };
        }

        const getRow = (page) => new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('prev_page')
                .setLabel('⬅️')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page === 0),
            new ButtonBuilder()
                .setCustomId('next_page')
                .setLabel('➡️')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page === totalPages - 1)
        );

        const replyMsg = await interaction.editReply({
            embeds: [getEmbed(currentPage)],
            components: [getRow(currentPage)]
        });

        const collector = interaction.channel.createMessageComponentCollector({
            filter: i => i.user.id === interaction.user.id && ['prev_page', 'next_page'].includes(i.customId),
            time: 120000
        });

        collector.on('collect', async i => {
            if (i.customId === 'prev_page' && currentPage > 0) currentPage--;
            if (i.customId === 'next_page' && currentPage < totalPages - 1) currentPage++;

            await i.update({ embeds: [getEmbed(currentPage)], components: [getRow(currentPage)] });
        });

        collector.on('end', async () => {
            await interaction.editReply({
                embeds: [getEmbed(currentPage)],
                components: [getRow(currentPage).setComponents(
                    ...getRow(currentPage).components.map(btn => btn.setDisabled(true))
                )]
            });
        });

    } catch (error) {
        console.log("Đã có lỗi khi lấy lịch phim sắp chiếu")
        await interaction.editReply('Có lỗi khi lấy lịch phim sắp chiếu tại Cinestar')
    }
}
