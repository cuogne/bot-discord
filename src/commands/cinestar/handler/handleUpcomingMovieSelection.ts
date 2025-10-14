import { Interaction, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import { getLinkAPI } from "../api/getLinkAPI";
import { formatDayVN } from "../utils/formatDayVN";

export async function handleUpcomingMovieSelection(interaction: Interaction) {
    if (!interaction.isStringSelectMenu()) return;
    
    await interaction.deferReply();

    const idx = interaction.values[0];

    try {
        const api = await getLinkAPI() ?? '';
        const response = await fetch(api);
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

        let components: ActionRowBuilder<ButtonBuilder>[] = [];

        if (buttonTrailer) {
            const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(buttonTrailer);
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
    }
    catch (error) {
        console.error('Lỗi khi xử lý chọn phim sắp chiếu:', error);
        await interaction.editReply('Có lỗi xảy ra khi xử lý yêu cầu.');
    }
}