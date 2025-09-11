import { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } from 'discord.js';
import { formatDayVN } from './formatDayVN.js';
import { getApiCinestar } from '../../utils/getApiCinestar.js';

export async function upcomingMoviesCommand(interaction) {
    await interaction.deferReply();

    const api = await getApiCinestar();

    try {
        const response = await fetch(api);
        const data = await response.json();

        // const dataMovie = data.pageProps.res.listComingMovie.map(movie => movie.release_date)
        // console.log(dataMovie)

        const listMovie = data.pageProps.res.listComingMovie.map(movie => ({
            name: movie.name_vn,
            releaseDate: formatDayVN(movie.release_date.split(' ')[0])
        }));
        // const listMovie = []
        // data.pageProps.res.listComingMovie.forEach(movie => {
        //     const nameMovie = movie.name_vn;
        //     const releaseDate = formatDayVN(movie.release_date.split(' ')[0]);
        //     const genre = movie.type_name_vn;
        //     const linkPoster = `[Poster](<${movie.image}>)`;
        //     const linkTrailer = movie.trailer ? `[Trailer](<https://youtu.be/${movie.trailer}>)` : 'Trailer';
        //     const minute = movie.time;

        //     listMovie.push({
        //         name: nameMovie,
        //         releaseDate: releaseDate,
        //         duration: minute,
        //         genre: genre,
        //         poster: movie.image,
        //         trailer: movie.trailer ? `https://youtu.be/${movie.trailer}` : null
        //     });
        // });

        if (listMovie.length === 0) {
            await interaction.editReply('Không có lịch phim sắp chiếu.');
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle('🎬 Danh sách các phim sắp chiếu tại Cinestar')
            .setDescription(`Click vào nút bên dưới để xem danh sách các bộ phim \nsắp được khởi chiếu`)
            .setColor('#0099ff')
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`select_upcoming_movie`)
                    .setPlaceholder('Chọn một bộ phim để xem thông tin chi tiết...')
                    .addOptions(
                        listMovie.slice(0, 25).map((movie, index) => ({
                            label: movie.name.length > 100 ? movie.name.substring(0, 97) + '...' : movie.name,
                            value: String(index),
                            description: `Ngày chiếu: ${movie.releaseDate}`
                        }))
                    )
            );

        await interaction.editReply({
            embeds: [embed],
            components: [row]
        });
    }
    catch (error) {
        console.log("Đã có lỗi khi lấy lịch phim sắp chiếu", error)
        await interaction.editReply('Có lỗi khi lấy lịch phim sắp chiếu tại Cinestar')
    }
}