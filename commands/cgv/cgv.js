import { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } from 'discord.js';
import { CGVTheater } from "./CGVTheater.js";
import { getData } from "./getData.js";
import { checkFile } from './utils/checkFile.js'
import { setFileName } from './utils/setFileName.js'
import { getCurrentDate } from './utils/getCurrentDate.js'
import * as fs from 'fs'
import * as path from 'path'

export async function cgvCommand(interaction) {
    await interaction.deferReply();

    // comment this reply to run command on local 
    await interaction.editReply({
        content: 'Command /cgv này không còn hoạt động. Để xem các phim đang chiếu tại CGV, hãy vào link website chính thức của CGV: https://cgv.vn/',
    });
    return;

    const province = interaction.options.getString('province')          // get province from user
    const cinemaName = interaction.options.getString('cinema')          // get cinema from user
    const dataCinema = CGVTheater[province][cinemaName]                 // get data cinema from CGVTheater

    const __dirname = path.dirname(new URL(import.meta.url).pathname);  // lay duong dan thu muc hien tai cua file
    const dataDir = path.join(__dirname, 'data');                       // duong dan thu muc data (test/data)
    const fileName = setFileName(province, cinemaName)                  // dd-mm-yyyy-id_file-cgv-data.json

    let processedData = ""

    // sai rạp
    if (!dataCinema) {
        await interaction.editReply('Không tìm thấy rạp này')
        return;
    }

    const id_cinema = dataCinema.id // get id of cgv cinema

    try {
        let check = checkFile(fileName)

        // neu file khong ton tai
        if (!check) {
            const files = fs.readdirSync(dataDir); // lay danh sach file trong dataDir

            const listNow = files.filter(file =>
                !file.startsWith(getCurrentDate()) && file !== '.gitkeep'
            )

            if (listNow.length > 0) {
                listNow.forEach(file => {
                    fs.unlinkSync(path.join(dataDir, file));
                });
            }

            await interaction.editReply('🔄 Đang cập nhật lịch chiếu phim...');
            try {
                processedData = await getData(id_cinema, fileName)
            }
            catch (error) {
                console.error('Lỗi khi chạy script crawl:', error);
                await interaction.editReply('Có lỗi xảy ra khi cập nhật lịch chiếu phim.');
                return;
            }
        }
        else {
            processedData = JSON.parse(fs.readFileSync(`commands/cgv/data/${fileName}`, 'utf8'))
        }

        if (!processedData || processedData.length === 0) {
            await interaction.editReply('Không có phim nào được chiếu trong hôm nay')
            return;
        }

        const nameMovies = new Set();
        processedData.forEach(movie => {
            nameMovies.add(movie["Tên phim"]);
        });

        if (nameMovies.size === 0) {
            await interaction.editReply('Không có phim nào được chiếu trong hôm nay')
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(`🎬 Danh sách các phim đang chiếu tại ${dataCinema.name}`)
            .setDescription(`**Ngày:** ${getCurrentDate()} \n**Địa chỉ:** ${dataCinema.address}`)
            .setColor('#0099ff')
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`select_movie_cgv|${province}|${cinemaName}`)
                    .setPlaceholder('Chọn phim')
                    .addOptions(
                        Array.from(nameMovies).slice(0, 25).map((movieName, index) => ({
                            label: movieName.length > 100 ? movieName.substring(0, 97) + '...' : movieName,
                            value: String(index),
                            description: `Phim số ${index + 1}`
                        }))
                    )
            );

        await interaction.editReply({ embeds: [embed], components: [row] });

    }
    catch (error) {
        console.error("Loi khi crawl cgv", error)
    }
}