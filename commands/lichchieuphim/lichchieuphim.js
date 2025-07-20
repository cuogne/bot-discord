import { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';
import { crawlCinestar } from './func/crawlCinestar.js';
import { setFilename } from './func/setFilename.js';

// format file name: 'dd-mm-yyyy-detail-film.json', 'dd-mm-yyyy-name-film.json'
const DIRECTORY = 'data'; // folder contains json data

export async function lichchieuphimCommand(interaction) {
    await interaction.deferReply();

    try {
        const today = new Date(); // lay ngay hien tai
        const dateStr = today.toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh'
        }).split(" ")[1]; // lay ngay (dd/mm/yyyy)

        const dayFileName = setFilename(dateStr);

        // get path of data
        const currentDir = path.dirname(import.meta.url.replace('file://', ''));
        const dataDir = path.join(currentDir, DIRECTORY);

        // check file exist
        const detailFile = path.join(dataDir, `${dayFileName}-detail-film.json`);
        const nameFile = path.join(dataDir, `${dayFileName}-name-film.json`);

        let needCrawl = false;
        if (!fs.existsSync(detailFile) || !fs.existsSync(nameFile)) {
            needCrawl = true;
        } else {
            // check file startsWith is today
            const files = fs.readdirSync(dataDir);
            const todayFiles = files.filter(file => file.startsWith(dayFileName));

            if (todayFiles.length === 0) {
                needCrawl = true;
            }
        }

        if (needCrawl) {
            // delete all file in /data folder
            if (fs.existsSync(dataDir)) {
                const files = fs.readdirSync(dataDir);
                files.forEach(file => {
                    fs.unlinkSync(path.join(dataDir, file));
                });
            }

            await interaction.editReply('🔄 Đang cập nhật lịch chiếu phim...');

            try {
                await crawlCinestar();
            } catch (error) {
                console.error('Lỗi khi chạy script crawl:', error);
                await interaction.editReply('Có lỗi xảy ra khi cập nhật lịch chiếu phim.');
                return;
            }
        }

        if (!fs.existsSync(nameFile)) {
            await interaction.editReply('Không tìm thấy dữ liệu lịch chiếu phim.');
            return;
        }

        const movieNames = JSON.parse(fs.readFileSync(nameFile, 'utf8'));

        if (movieNames.length === 0) {
            await interaction.editReply('Không có lịch chiếu phim cho hôm nay.');
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle('🎬 Danh sách các phim')
            .setDescription('Chọn phim bạn muốn xem lịch chiếu:')
            .setColor('#0099ff')
            .setTimestamp();

        // create select menu for movie list
        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('select_movie')
                    .setPlaceholder('Chọn phim...')
                    .addOptions(
                        movieNames.map((movieName, index) => ({
                            label: movieName.length > 100 ? movieName.substring(0, 97) + '...' : movieName,
                            value: movieName,
                            description: `Phim số ${index + 1}`
                        }))
                    )
            );

        await interaction.editReply({ embeds: [embed], components: [row] });

    } catch (error) {
        console.error('Lỗi trong lichchieuphimCommand:', error);
        await interaction.editReply('Có lỗi xảy ra khi xử lý lệnh.');
    }
}


