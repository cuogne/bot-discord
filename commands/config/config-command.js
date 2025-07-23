import { SlashCommandBuilder } from "discord.js";
import { dateCommand } from '../date/date.js';
import { getAvatarCommand } from '../getAvt/getAvt.js';
import { lookUpSBDCommand } from '../diemthptqg2025/crawlScore.js'
import { lichchieuphimCommand } from "../lichchieuphim/lichchieuphim.js";
import { handleMovieSelection } from "../lichchieuphim/handleInteraction.js";
// import command do vo day

// add command
export const commands = [
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
        ),

    new SlashCommandBuilder()
        .setName('cinestar')
        .setDescription('Hiển thị lịch chiếu phim hôm nay tại Cinestar')

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
    //
};

// export handle selection from user
export const handleSelection = {
    select_movie: handleMovieSelection
}