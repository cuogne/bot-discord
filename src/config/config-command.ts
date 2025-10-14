import { SlashCommandBuilder, ChannelType, ChatInputCommandInteraction, Interaction } from "discord.js";

import { helpCommand } from "./helpCommand";
import { randomCommand } from "../commands/random/randomCommand";
import { getAvatarCommand } from "../commands/getAvatar/chooseAvatar";
import { getTodayCommand } from "../commands/today/today";
import { diemthptqgCommand } from "../commands/thptqg/diemthptqg";
import { dictionaryCommand } from "../commands/dictionary/dictionaryCommand";
import { getImageCommand } from "../commands/getImage/getImageCommand";
import { pokemonCommand } from "../commands/pokemon/pokemonCommand";
import { translateCommand } from "../commands/translate/translateCommand";
import { cinestarCommand } from "../commands/cinestar/cinestarCommand";

import { handleMovieTodaySelection } from "../commands/cinestar/handler/handleMovieTodaySelection";
import { handleUpcomingMovieSelection } from "../commands/cinestar/handler/handleUpcomingMovieSelection";

// add command
export const commands = [
    new SlashCommandBuilder()
        .setName('help')
        .setDescription('Hiển thị các command hiện có của bot'),

    new SlashCommandBuilder()
        .setName('random')
        .setDescription('Chọn ngẫu nhiên một mục từ danh sách bạn nhập')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Nhập các lựa chọn, cách nhau bằng dấu phẩy')
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Xem avatar')
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Xem avatar của ai đó')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('Chọn người dùng để xem avatar (để trống thì xem ảnh của bạn)')
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('Xem avatar của server')
        ),

    new SlashCommandBuilder()
        .setName('today')
        .setDescription('Xem ngày hiện tại (dương lịch & âm lịch)'),

    new SlashCommandBuilder()
        .setName('sbd')
        .setDescription('Tra cứu điểm thi THPTQG 2025')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Nhập số báo danh (8 chữ số)')
                .setRequired(true)
                .setMaxLength(8)
                .setMinLength(8)
        ),

    new SlashCommandBuilder()
        .setName('dictionary')
        .setDescription('Tra từ điển tiếng Anh (định nghĩa, phiên âm, từ đồng nghĩa/trái nghĩa, ...)')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Nhập từ tiếng Anh cần tra')
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('image')
        .setDescription("Trả về ảnh ngẫu nhiên")
        .addSubcommand(subcommand =>
            subcommand
                .setName('cat')
                .setDescription('Xem ảnh mèo ngẫu nhiên')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('dog')
                .setDescription('Xem ảnh chó ngẫu nhiên')
        ),

    new SlashCommandBuilder()
        .setName('pokemon')
        .setDescription('Who\'s that Pokémon?')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Nhập tên Pokémon bạn muốn tìm (ex: pikachu)')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('id')
                .setDescription('Nhập ID Pokémon bạn muốn tìm (giá trị trong khoảng 1-1025 hoặc 10001-10277)')
                .setRequired(false)
        ),

    new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Dịch từ vựng và các câu nhỏ')
    .addStringOption(option =>
        option.setName('to')
            .setDescription('Chọn ngôn ngữ đích muốn dịch sang')
            .setRequired(true)
            .addChoices(
                { name: '🇻🇳 Tiếng Việt', value: 'vi' },
                { name: '🇬🇧 Tiếng Anh', value: 'en' },
                { name: '🇯🇵 Tiếng Nhật', value: 'ja' },
                { name: '🇰🇷 Tiếng Hàn', value: 'ko' },
                { name: '🇨🇳 Tiếng Trung', value: 'zh' },
                { name: '🇫🇷 Tiếng Pháp', value: 'fr' },
                { name: '🇩🇪 Tiếng Đức', value: 'de' },
            )
    )
    .addStringOption(option =>
        option.setName('text')
            .setDescription('Nhập từ hoặc câu cần dịch (giới hạn 1000 ký tự)')
            .setRequired(true)
    ),

    new SlashCommandBuilder()
        .setName('cinestar')
        .setDescription('Xem lịch chiếu phim tại rạp Cinestar')
        .addSubcommand(subcommand =>
            subcommand
                .setName('today')
                .setDescription('Xem lịch chiếu phim tại Cinestar hôm nay')
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
                )
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('upcoming')
                .setDescription('Hiển thị danh sách các phim sắp chiếu tại Cinestar')
        ),
];

// export command
export const commandHandlers: Record<string, (interaction: ChatInputCommandInteraction) => Promise<void>> = {
    help: helpCommand,
    random: randomCommand,
    avatar: getAvatarCommand,
    today: getTodayCommand,
    sbd: diemthptqgCommand,
    dictionary: dictionaryCommand,
    image: getImageCommand,
    pokemon: pokemonCommand,
    translate: translateCommand,
    cinestar: cinestarCommand
};

export const handleSelection = {
    select_movie: handleMovieTodaySelection,
    select_upcoming_movie: handleUpcomingMovieSelection,
    // select_movie_cgv: handleSelectionMovieCGV
} as const;
