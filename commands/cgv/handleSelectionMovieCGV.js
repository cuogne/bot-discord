import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';
import { setFileName } from '../cgv/utils/setFileName.js';
import { formatDay } from './utils/formatDay.js';

export async function handleSelectionMovieCGV(interaction) {
    try {
        const [_, province, cinema] = interaction.customId.split('|')
        const selectedIndex = parseInt(interaction.values[0])
        const detailFile = path.join('commands', 'cgv', 'data', setFileName(province, cinema));

        if (!fs.existsSync(detailFile)) {
            await interaction.reply({ content: 'Không tìm thấy dữ liệu chi tiết phim.' });
            return;
        }

        const movieDetails = JSON.parse(fs.readFileSync(detailFile, 'utf8'));

        const nameMovies = [...new Set(movieDetails.map(movie => movie["Tên phim"]))];

        if (selectedIndex >= nameMovies.length) {
            await interaction.reply({ content: 'Phim không tồn tại.' });
            return;
        }

        const selectedMovieName = nameMovies[selectedIndex];

        const selectedMovieDetails = movieDetails.filter(movie => movie["Tên phim"] === selectedMovieName);

        if (selectedMovieDetails.length === 0) {
            await interaction.reply({ content: 'Không tìm thấy thông tin chi tiết cho phim này.' });
            return;
        }

        // create embed
        const embed = new EmbedBuilder()
            .setTitle(`🎬 ${selectedMovieName}`)
            .setColor('#00ff00')
            .setTimestamp();

        if (selectedMovieDetails[0]["link_posterImg"]) {
            embed.setThumbnail(selectedMovieDetails[0]["link_posterImg"]);
        }

        embed.addFields(
            { name: '📅 Ngày chiếu', value: formatDay(selectedMovieDetails[0]["Ngày"]), inline: true },
            { name: '⏱️ Thời lượng', value: selectedMovieDetails[0]["Thời lượng"], inline: true },
            { name: '📽️ Rạp', value: selectedMovieDetails[0]["Tên rạp"], inline: true },
        );

        const roomTypes = selectedMovieDetails[0]["Loại phòng"];
        if (roomTypes && Object.keys(roomTypes).length > 0) {
            let scheduleText = '';

            // Get current time
            const now = new Date();
            const currentTime = now.toLocaleTimeString('vi-VN', {
                timeZone: 'Asia/Ho_Chi_Minh',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });

            Object.entries(roomTypes).forEach(([roomType, times]) => {
                if (Array.isArray(times) && times.length > 0) {
                    // Filter upcoming times for this room type
                    const upcomingTimes = times.filter(showTime => {
                        return showTime > currentTime;
                    });

                    if (upcomingTimes.length > 0) {
                        scheduleText += `**${roomType}:** ${upcomingTimes.join(', ')}\n\n`;
                    }
                }
            });

            if (scheduleText) {
                embed.addFields({ name: '🕐 Lịch chiếu', value: scheduleText });
            } else {
                embed.addFields({ name: '🕐 Lịch chiếu', value: 'Không còn suất chiếu nào trong hôm nay' });
            }
        }

        await interaction.reply({
            embeds: [embed],
        });
    }
    catch (error) {
        console.error('Lỗi khi xử lý lựa chọn phim CGV:', error);
        await interaction.reply({
            content: 'Có lỗi xảy ra khi xử lý thông tin phim',
        });
    }
}