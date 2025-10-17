import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} from 'discord.js';
import { getCinema, getFileName } from '../constant/get.js';
import * as fs from 'fs';
import * as path from 'path';
import { getDataDir } from '../constant/get.js';

// handle interaction khi user chọn phim từ dropdown
export async function handleMovieTodaySelection(interaction, nameCinema) {
    if (!interaction.isStringSelectMenu()) return;

    const dataDir = getDataDir();

    try {
        const cinema = getCinema(nameCinema);
        const fileName = getFileName(nameCinema);

        const selectedMovie = interaction.values[0];
        const detailFile = path.join(dataDir, fileName);

        if (!fs.existsSync(detailFile)) {
            await interaction.reply({ content: 'Không tìm thấy dữ liệu chi tiết phim.' });
            return;
        }

        const movieDetails = JSON.parse(fs.readFileSync(detailFile, 'utf8'));
        const selectedMovieDetails = movieDetails.filter(movie => movie["Tên phim"] === selectedMovie);

        if (selectedMovieDetails.length === 0) {
            await interaction.reply({ content: 'Không tìm thấy thông tin chi tiết cho phim này.' });
            return;
        }

        // create button booking film
        const bookingLink = selectedMovieDetails[0]["Link đặt vé"] || 'https://cinestar.com.vn';
        const trailerLink = selectedMovieDetails[0]["trailer"] || '';

        const embed = createEmbed(selectedMovie, selectedMovieDetails, cinema);
        const components = createButton(bookingLink, trailerLink);

        await interaction.reply({
            embeds: [embed],
            components: components
        });

    }
    catch (error) {
        console.error('Lỗi khi xử lý chọn phim:', error);
        await interaction.reply({ content: 'Có lỗi xảy ra khi xử lý yêu cầu.' });
    }
}

function createEmbed(selectedMovie, selectedMovieDetails, cinema) {
    // create embed
    const embed = new EmbedBuilder()
        .setTitle(`🎬 ${selectedMovie}`)
        .setColor('#00ff00')
        .setTimestamp();

    // get link image and add to embed
    const movieWithImage = selectedMovieDetails.find(movie => movie["Link ảnh"]);
    if (movieWithImage && movieWithImage["Link ảnh"]) {
        embed.setThumbnail(movieWithImage["Link ảnh"]);
    }

    embed.addFields(
        { name: '📅 Ngày chiếu', value: selectedMovieDetails[0]["Ngày"], inline: true },
        { name: '⏱️ Thời lượng', value: selectedMovieDetails[0].minute + ' phút' || 'N/A', inline: true },
        { name: '📽️ Rạp', value: cinema.name, inline: true },
        { name: '🎭 Thể loại', value: selectedMovieDetails[0].genre || 'N/A', inline: true },
        { name: '📝 Ngôn ngữ', value: selectedMovieDetails[0].format_language || 'N/A', inline: true },
        {
            name: '📑 Nội dung phim',
            value: selectedMovieDetails[0].brief.length > 1024 ?
                selectedMovieDetails[0].brief.substring(0, 1021) + '...' :
                selectedMovieDetails[0].brief || 'N/A'
        }
    );

    let scheduleText = '';

    // lay thoi gian hien tai
    const now = new Date();
    const currentTime = now.toLocaleTimeString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    // lay gio chieu phim
    const allTimes = selectedMovieDetails
        .map(movie => movie["Giờ chiếu"])
        .filter(time => time)
        .join(', ')
        .split(',')
        .map(time => time.trim())
        .filter(time => time);

    // loc ra nhung gio hop le
    const upcomingTimes = allTimes.filter(showTime => {
        return showTime > currentTime;
    });

    const uniqueTimes = [...new Set(upcomingTimes)].sort(); // loc duplicate va sort

    if (uniqueTimes.length > 0) {
        if (uniqueTimes.length > 6) {
            const mid = Math.ceil(uniqueTimes.length / 2);
            const col1 = uniqueTimes.slice(0, mid);
            const col2 = uniqueTimes.slice(mid);

            scheduleText = `\`${col1.join('\`  \`')}\`\n\n\`${col2.join('\`  \`')}\``;
        } else {
            scheduleText = `\`${uniqueTimes.join('`  `')}\``;
        }

        embed.addFields({ name: '🕐 Lịch chiếu', value: scheduleText });
    } else {
        embed.addFields({ name: '🕐 Lịch chiếu', value: 'Không còn suất chiếu nào trong hôm nay' });
    }

    return embed;
}

function createButton(bookingLink, trailerLink) {
    const bookingButton = new ButtonBuilder()
        .setLabel('🎟️ Đặt vé ngay')
        .setStyle(ButtonStyle.Link)
        .setURL(bookingLink);

    let components = [];
    if (trailerLink) {
        const trailerButton = new ButtonBuilder() // có link thì mới hiển thị button
            .setLabel('🎬 Xem trailer')
            .setStyle(ButtonStyle.Link)
            .setURL(trailerLink);
        const actionRow = new ActionRowBuilder().addComponents(bookingButton, trailerButton);
        components = [actionRow.toJSON()];
    }
    else {
        const actionRow = new ActionRowBuilder().addComponents(bookingButton);
        components = [actionRow.toJSON()];
    }
    return components;
}