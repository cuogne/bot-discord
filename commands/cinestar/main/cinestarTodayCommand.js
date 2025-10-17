import { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } from 'discord.js';
import { checkFileExists } from "../utils/checkFileExists.js";
import { getCinema, getFileName } from "../constant/get.js";
import { setFileName } from "../utils/setFileName.js";
import { getToday } from "../utils/getToday.js";
import { getDataMovie } from "../api/api-cinestar.js";
import * as fs from 'fs'
import * as path from 'path'

export async function cinestarTodayCommand(interaction) {
    await interaction.deferReply();

    const option = interaction.options.getString('cinema') || ""

    const projectRoot = path.resolve();
    const dataDir = path.join(projectRoot, 'commands', 'cinestar', 'data'); // duong dan thu muc data (chua cac bo phim)

    const cinema = getCinema(option);
    const fileName = getFileName(option);

    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
        fs.writeFileSync(path.join(dataDir, '.gitkeep'), ''); // tao file .gitkeep de giu nguyen thu muc trong git
    }

    try {
        let checkExists = checkFileExists(fileName);
        if (!checkExists){
            if (fs.existsSync(dataDir)) {
                const files = fs.readdirSync(dataDir);

                const listNow = files.filter(file =>
                    !file.startsWith(setFileName(getToday())) && file !== '.gitkeep'
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
                await getDataMovie(cinema, fileName);
            }
            catch (error) {
                console.error('Lỗi khi chạy script crawl:', error);
                await interaction.editReply('Có lỗi xảy ra khi cập nhật lịch chiếu phim.');
                return;
            }
        }

        const movieJson = path.join(dataDir, fileName);

        if (!fs.existsSync(movieJson)) {
            await interaction.editReply('Không tìm thấy dữ liệu lịch chiếu phim.');
            return;
        }

        const dayFileName = getToday();
        const movieData = JSON.parse(fs.readFileSync(movieJson, 'utf8'));
        if (!Array.isArray(movieData)) {
            console.error('Dữ liệu sai định dạng')
            await interaction.editReply('Dữ liệu phim sai định dạng')
        }

        const movieNames = movieData
            .map((movie) => movie["Tên phim"])
            .filter((name) => name && name.trim() != '');

        if (movieNames.length === 0) {
            await interaction.editReply('Không có lịch chiếu phim cho hôm nay.');
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle('🎬 Danh sách các phim đang chiếu tại Cinestar')
            .setDescription(`Rạp:  ${cinema.name} 
                \nNgày: ${dayFileName}
                \nChọn phim bạn muốn xem lịch chiếu hôm nay:`)
            .setColor('#0099ff')
            .setTimestamp();

        // create select menu for movie list
        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`select_movie|${cinema.name}`) // gui interaction cinema kem voi customId
                    .setPlaceholder('Chọn phim...')
                    .addOptions(
                        movieNames.map((movieName, index) => ({
                            label: movieName.length > 100 ? movieName.substring(0, 97) + '...' : movieName,
                            value: movieName,
                            description: `Phim số ${index + 1}`
                        }))
                    )
            );

        await interaction.editReply({ embeds: [embed], components: [row.toJSON()] });

    }
    catch (error) {
        console.error('Lỗi trong cinestarTodayCommand:', error);
        await interaction.editReply('Có lỗi xảy ra khi xử lý lệnh.');
    }
}