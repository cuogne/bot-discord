import { EmbedBuilder } from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';
import { location_cinema } from './func/crawlCinestar.js';
import { setFilename } from './func/setFilename.js';
import { time } from 'console';

// handle interaction khi user chọn phim từ dropdown
export async function handleMovieSelection(interaction) {
    if (!interaction.isStringSelectMenu()) return;

    try {
        const selectedMovie = interaction.values[0];

        const today = new Date();
        const dateStr = today.toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh'
        }).split(" ")[1];

        const dayFileName = setFilename(dateStr);

        const currentDir = path.dirname(import.meta.url.replace('file://', ''));
        const dataDir = path.join(currentDir, 'data');
        const detailFile = path.join(dataDir, `${dayFileName}-detail-film.json`);

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

        // const groupedByRoom = {};
        // selectedMovieDetails.forEach(movie => {
        //     const roomType = movie["Loại phòng"];
        //     if (!groupedByRoom[roomType]) {
        //         groupedByRoom[roomType] = [];
        //     }
        //     groupedByRoom[roomType].push(movie["Giờ chiếu"]);
        // });

        embed.addFields(
            { name: '📅 Ngày chiếu', value: selectedMovieDetails[0]["Ngày"], inline: true },
            { name: '⏱️ Thời lượng', value: selectedMovieDetails[0].minute + ' phút' || 'N/A', inline: true },
            { name: '📽️ Rạp', value: location_cinema, inline: true },
            { name: '🎭 Thể loại', value: selectedMovieDetails[0].genre || 'N/A', inline: true },
            { name: '🎬 Định dạng', value: selectedMovieDetails[0].format_language || 'N/A', inline: true }
        );

        // let scheduleText = '';
        // for (const [roomType, times] of Object.entries(groupedByRoom)) {
        //     scheduleText += `**${roomType}:**\n`;
        //     scheduleText += times.join(', ') + '\n\n';
        // }

        let scheduleText = '';
        const allTimes = selectedMovieDetails.map(movie => movie["Giờ chiếu"]).filter(time => time);
        scheduleText = allTimes.join(', ');

        if (scheduleText) {
            embed.addFields({ name: '🕐 Lịch chiếu', value: scheduleText });
        }

        await interaction.reply({ embeds: [embed] });

    } catch (error) {
        console.error('Lỗi khi xử lý chọn phim:', error);
        await interaction.reply({ content: 'Có lỗi xảy ra khi xử lý yêu cầu.' });
    }
} 