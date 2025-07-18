import { SlashCommandBuilder } from "discord.js";
import { dateCommand } from '../date/date.js';
import { getAvatarCommand } from '../getAvt/getAvt.js';
// import command do vo day

// add command
export const commands = [
    new SlashCommandBuilder()
        .setName('date')
        .setDescription('Hiển thị ngày giờ hiện tại'),

    new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('get avatar')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Chọn user để lấy avatar')
                .setRequired(false)
        ),

    // new SlashCommandBuilder()
    //     .setName('gemini')
    //     .setDescription('Chat with gemini')
    //     .addStringOption(option =>
    //         option.setName('text')
    //             .setDescription("Noi dung can hoi gemini")
    //             .setRequired(true)
    //     )

    // new SlashCommandBuilder()
    //     .setName(...)
    //     .setDescription(...)
];

// export command
export const commandHandlers = {
    date: dateCommand,
    avatar: getAvatarCommand,
    //
};