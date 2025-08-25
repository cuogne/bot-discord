import { SlashCommandBuilder, ChannelType } from "discord.js";
import { dateCommand } from '../date/date.js';
import { getAvatarCommand } from '../getAvt/getAvt.js';
import { lookUpSBDCommand } from '../diemthptqg2025/crawlScore.js'
import { lichchieuphimCommand } from "../lichchieuphim/lichchieuphim.js";
import { gayCommand } from "../gay/gay.js";
import { translateCommand } from "../translate/translate.js";
import { randomCommand } from "../random/random.js";
import { footballTournamentCommand } from "../football_tournament/football_tournament.js";
import { footballClubCommand } from "../football_club/football_club.js";
import { upcomingMoviesCommand } from "../upcomingmovies/upcomingMoviesCommand.js";
import { dictionaryCommand } from "../dictionary/dictionary.js";
import { helpCommand } from "./helpCommand.js";
import { cgvCommand } from "../cgv/cgv.js";
import { footballScoreCommand } from "../football_score/football_score.js";
import { fitNewsCommand } from '../fit-hcmus-news/fitNewsCommand.js';

import { handleMovieSelection } from "../lichchieuphim/handleInteraction.js";
import { handleUpcomingMovieSelection } from "../upcomingmovies/handleSelectionUpcomingMovie.js";
import { handleSelectionMovieCGV } from "../cgv/handleSelectionMovieCGV.js";
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
        .addStringOption(option =>
            option.setName('club')
                .setDescription('Chọn câu lạc bộ')
                .setRequired(true)
                .addChoices(
                    { name: 'Manchester United', value: '360' },
                    { name: 'Manchester City', value: '382' },
                    { name: 'Chelsea', value: '363' },
                    { name: 'Liverpool', value: '364' },
                    { name: 'Arsenal', value: '359' },
                    { name: 'Real Madrid', value: '86' },
                    { name: 'Barcelona', value: '83' },
                    { name: 'Atletico Madrid', value: '1068' },
                    { name: 'Bayern Munich', value: '132' },
                    { name: 'Borussia Dortmund', value: '124' },
                    { name: 'Bayer Leverkusen', value: '131' },
                    { name: 'Paris Saint Germain (PSG)', value: '160' },
                    { name: 'Inter Milan', value: '110' },
                    { name: 'AC Milan', value: '103' },
                    { name: 'AS Roma', value: '104' },
                    { name: 'Napoli', value: '114' },
                    { name: 'Juventus', value: '111' }
                )
        ),

    new SlashCommandBuilder()
        .setName('upcoming_movies')
        .setDescription('Hiển thị các phim sắp chiếu tại Cinestar'),

    // /dictionary {text}
    new SlashCommandBuilder()
        .setName('dictionary')
        .setDescription('Tra từ điển tiếng Anh (định nghĩa, phiên âm, từ đồng nghĩa/trái nghĩa, ...)')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Nhập từ tiếng Anh cần tra')
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('help')
        .setDescription('Hiển thị các command hiện có của bot'),

    new SlashCommandBuilder()
        .setName('cgv')
        .setDescription('Hiển thị lịch chiếu phim tại CGV (Không hoạt động)')
        .addStringOption(option =>
            option.setName('province')
                .setDescription('Chọn tỉnh/thành phố (chỉ hỗ trợ một số tỉnh/thành phố và dữ liệu hiện tại là trước khi sáp nhập)')
                .setRequired(true)
                .setAutocomplete(true)
        )
        .addStringOption(option =>
            option.setName('cinema')
                .setDescription('Chọn rạp chiếu phim')
                .setRequired(true)
                .setAutocomplete(true)
        ),

    new SlashCommandBuilder()
        .setName('football_score')
        .setDescription('Xem tỉ số của các trận đấu bóng đá đêm qua và rạng sáng nay'),

    new SlashCommandBuilder()
        .setName('fit-hcmus-news')
        .setDescription('Xem tin tức mới nhất từ FIT HCMUS')
        .addSubcommand(subcommand =>
            subcommand
                .setName('latest')
                .setDescription('Lấy tin gần nhất')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('setup')
                .setDescription('Cấu hình channel để lấy tin tức')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('Chọn channel để gửi tin mới nhất')
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('status')
                .setDescription('Hiển thị channel đã chọn để gửi tin tức')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Xóa channel đã cấu hình')
        ),

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
    upcoming_movies: upcomingMoviesCommand,
    dictionary: dictionaryCommand,
    help: helpCommand,
    cgv: cgvCommand,
    football_score: footballScoreCommand,
    'fit-hcmus-news': fitNewsCommand,
    //
};

// export handle selection from user
export const handleSelection = {
    select_movie: handleMovieSelection,
    select_upcoming_movie: handleUpcomingMovieSelection,
    select_movie_cgv: handleSelectionMovieCGV
}