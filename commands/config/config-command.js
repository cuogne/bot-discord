import { SlashCommandBuilder } from "discord.js";
import { dateCommand } from '../date/date.js';
import { getAvatarCommand } from '../getAvt/getAvt.js';
import { lookUpSBDCommand } from '../diemthptqg2025/crawlScore.js'
import { lichchieuphimCommand } from "../lichchieuphim/lichchieuphim.js";
import { gayCommand } from "../gay/gay.js";
import { translateCommand } from "../translate/translate.js";
import { randomCommand } from "../random/random.js";
import { footballTournamentCommand } from "../football_tournament/football_tournament.js";
import { footballClubCommand } from "../football_club/football_club.js";

import { handleMovieSelection } from "../lichchieuphim/handleInteraction.js";
// import command do vo day

// add command
export const commands = [
    // /date
    new SlashCommandBuilder()
        .setName('date')
        .setDescription('Hiển thị ngày giờ hiện tại'),

    new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Lấy avatar')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Chọn user để lấy avatar')
                .setRequired(false)
        ),

    // /sbd {text}
    new SlashCommandBuilder()
        .setName('sbd')
        .setDescription('Tra cứu điểm thi THPTQG 2025 thông qua số báo danh')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Nhập SBD (Phải có 8 chữ số)')
                .setRequired(true)
                .setMaxLength(8)
                .setMinLength(8)
        ),

    // /cinestar
    new SlashCommandBuilder()
        .setName('cinestar')
        .setDescription('Hiển thị lịch chiếu phim hôm nay tại Cinestar')
        .addStringOption(option =>
            option.setName('cinema')
                .setDescription('Chọn rạp chiếu phim')
                .setRequired(true)
                .addChoices(
                    { name: '🎬 Cinestar Sinh Viên - TP.HCM', value: 'Cinestar Sinh Viên - TP.HCM' },
                    { name: '🎬 Cinestar Quốc Thanh - TP.HCM', value: 'Cinestar Quốc Thanh - TP.HCM' },
                    { name: '🎬 Cinestar Hai Bà Trưng - TP.HCM', value: 'Cinestar Hai Bà Trưng - TP.HCM' },
                    { name: '🎬 Cinestar Satra - TP.HCM', value: 'Cinestar Satra - TP.HCM' },
                    { name: '🎬 Cinestar Đà Lạt - Lâm Đồng', value: 'Cinestar Đà Lạt - Lâm Đồng' },
                    { name: '🎬 Cinestar Lâm Đồng - Lâm Đồng', value: 'Cinestar Lâm Đồng - Lâm Đồng' },
                    { name: '🎬 Cinestar Huế - TP.Huế', value: 'Cinestar Huế - TP.Huế' },
                    { name: '🎬 Cinestar Mỹ Tho - Đồng Tháp', value: 'Cinestar Mỹ Tho - Đồng Tháp' },
                    { name: '🎬 Cinestar Kiên Giang - An Giang', value: 'Cinestar Kiên Giang - An Giang' },
                )
        ),

    // /gay
    new SlashCommandBuilder()
        .setName('gay')
        .setDescription('Long toi tan nat khi nhan ra...')
        .addStringOption(option =>
            option.setName('user')
                .setDescription('Điền tên vào !?')
                .setRequired(true)
        ),

    // /translate
    new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Dịch từ vựng và các câu nhỏ')
        .addStringOption(option =>
            option.setName('to')
                .setDescription('Chọn ngôn ngữ đích muốn dịch sang')
                .setRequired(true)
                .addChoices(
                    { name: '🇻🇳 Tiếng Việt', value: 'vi' },
                    { name: '🇺🇸 Tiếng Anh', value: 'en' },
                    { name: '🇯🇵 Tiếng Nhật', value: 'ja' },
                    { name: '🇰🇷 Tiếng Hàn', value: 'ko' },
                    { name: '🇨🇳 Tiếng Trung', value: 'zh' },
                    { name: '🇫🇷 Tiếng Pháp', value: 'fr' },
                    { name: '🇩🇪 Tiếng Đức', value: 'de' },
                )
        )
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Nhập từ hoặc câu cần dịch')
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('random')
        .setDescription('Chọn ngẫu nhiên một mục từ danh sách bạn nhập')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Nhập các lựa chọn, cách nhau bằng dấu phẩy')
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('football_tournament')
        .setDescription('⚽ Xem lịch thi đấu bóng đá Châu Âu hôm nay và các ngày lân cận ⚽')
        .addStringOption(option =>
            option.setName('tournament')
                .setDescription('Chọn giải đấu (Chưa hỗ trợ cho cúp C1, C2, Euro, World Cup, ...)')
                .setRequired(true)
                .addChoices(
                    { name: '🇬🇧 Primere League', value: 'eng.1' },
                    { name: '🇪🇸 La Liga', value: 'esp.1' },
                    { name: '🇩🇪 Bundesliga', value: 'ger.1' },
                    { name: '🇮🇹 Serie A', value: 'ita.1' },
                    { name: '🇫🇷 Ligue 1', value: 'fra.1' }
                )
        ),

    new SlashCommandBuilder()
        .setName('football_club')
        .setDescription('Xem lịch thi đấu bóng đá của 1 câu lạc bộ')

    // new SlashCommandBuilder()
    //     .setName(...)
    //     .setDescription(...)
];

// export command
export const commandHandlers = {
    date: dateCommand,
    avatar: getAvatarCommand,
    sbd: lookUpSBDCommand,
    cinestar: lichchieuphimCommand,
    gay: gayCommand,
    translate: translateCommand,
    random: randomCommand,
    football_tournament: footballTournamentCommand,
    football_club: footballClubCommand,
    //
};

// export handle selection from user
export const handleSelection = {
    select_movie: handleMovieSelection
}