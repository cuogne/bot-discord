import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } from "discord.js";
import { getLinkAPI } from "../api/get-link-api.js";
import { formatDayVN } from "../utils/formatDayVN.js";

export async function cinestarUpcomingMoviesCommand(interaction){
    await interaction.deferReply();

    const api = await getLinkAPI() ?? '';

    try {
        const response = await fetch(api);
        const data = await response.json();

        const listMovie = data.pageProps.res.listComingMovie.map(movie => ({
            name: movie.name_vn,
            releaseDate: formatDayVN(movie.release_date.split(' ')[0])
        }));

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
            components: [row.toJSON()]
        });
    }
    catch (error) {
        console.log("Đã có lỗi khi lấy lịch phim sắp chiếu", error)
        await interaction.editReply('Có lỗi khi lấy lịch phim sắp chiếu tại Cinestar')
    }
}