import { SlashCommandBuilder } from "discord.js";
import { dateCommand } from '../date/date.js';
// import command do vo day

// add command
export const commands = [
    new SlashCommandBuilder()
        .setName('date')
        .setDescription('Hiển thị ngày giờ hiện tại'),

    // new SlashCommandBuilder()
    //     .setName(...)
    //     .setDescription(...)
];

// export command
export const commandHandlers = {
    date: dateCommand,
    //
};