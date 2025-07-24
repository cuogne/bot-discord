import { SlashCommandBuilder } from "discord.js";
import { dateCommand } from '../date/date.js';
import { getAvatarCommand } from '../getAvt/getAvt.js';
import { lookUpSBDCommand } from '../diemthptqg2025/crawlScore.js'
import { lichchieuphimCommand } from "../lichchieuphim/lichchieuphim.js";
import { gayCommand } from "../gay/gay.js";
import { translateCommand } from "../translate/translate.js";
import { randomCommand } from "../random/random.js";

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
        .setDescription('Hiển thị lịch chiếu phim hôm nay tại Cinestar'),

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
    //
};

// export handle selection from user
export const handleSelection = {
    select_movie: handleMovieSelection
}