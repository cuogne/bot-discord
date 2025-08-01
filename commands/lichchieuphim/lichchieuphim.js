import { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';
import { getFileConfig, getCinemaConfig } from './config.js';
import { checkFileExists } from './utils/checkFileExists.js'
import { fetchAndProcessMovieData } from './handleData.js'
import { getCurrentDate } from './utils/getCurrentDate.js';
import { setFileName } from './utils/setFileName.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);  // lay duong dan thu muc hien tai cua file
const dataDir = path.join(__dirname, 'data');                       // duong dan thu muc data (test/data)

export async function lichchieuphimCommand(interaction) {
    await interaction.deferReply();

    // get option of user
    const option = interaction.options.getString('cinema')

    const CINEMA_CONFIG = getCinemaConfig(option) // CINEMA.id_MovieTheater[option]
    const FILE_CONFIG = getFileConfig(option)

    try {
        let checkExists = checkFileExists(FILE_CONFIG.fileName);

        // neu file kh ton tai thi moi chay lenh nay
        if (!checkExists) {
            if (fs.existsSync(dataDir)) {
                const files = fs.readdirSync(dataDir);

                const listNow = files.filter(file =>
                    !file.startsWith(setFileName(getCurrentDate())) && file !== '.gitkeep'
                );

                // if true => listNow is empty => listNow.length = 0
                // => all files in files startsWith current date
                if (listNow.length > 0) {
                    listNow.forEach(file => {
                        fs.unlinkSync(path.join(dataDir, file));
                    });
                }

            }
            await interaction.editReply('🔄 Đang cập nhật lịch chiếu phim...');

            try {
                await fetchAndProcessMovieData(CINEMA_CONFIG, FILE_CONFIG);
            }
            catch (error) {
                console.error('Lỗi khi chạy script crawl:', error);
                await interaction.editReply('Có lỗi xảy ra khi cập nhật lịch chiếu phim.');
                return;
            }
        }

        const movieJson = path.join(dataDir, FILE_CONFIG.fileName)

        if (!fs.existsSync(movieJson)) {
            await interaction.editReply('Không tìm thấy dữ liệu lịch chiếu phim.');
            return;
        }

        const dayFileName = getCurrentDate();
        const movieNames = JSON.parse(fs.readFileSync(movieJson, 'utf8'))
            .map(movie => movie["Tên phim"])
            .filter(name => name);

        // ------------------- LOG ----------------------------
        console.log(`[Current Date - lcp]: ${dayFileName}`)
        console.log(`[File Name - lcp]: ${FILE_CONFIG.fileName}`)
        console.log(`File path - lcp]: ${movieJson}`)
        console.log(`[MovieNames - lcp]: ${movieNames}`)
        // ----------------------------------------------------

        if (movieNames.length === 0) {
            await interaction.editReply('Không có lịch chiếu phim cho hôm nay.');
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle('🎬 Danh sách các phim đang chiếu tại Cinestar')
            .setDescription(`Rạp:  ${CINEMA_CONFIG.name} 
                \nNgày: ${dayFileName}
                \nChọn phim bạn muốn xem lịch chiếu hôm nay:`)
            .setColor('#0099ff')
            .setTimestamp();

        // create select menu for movie list
        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`select_movie|${CINEMA_CONFIG.name}`) // gui interaction cinema kem voi customId
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