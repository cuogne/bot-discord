import { SlashCommandBuilder, ChannelType, ChatInputCommandInteraction } from "discord.js";

import { helpCommand } from "./helpCommand";
import { randomCommand } from "../commands/random/randomCommand";
import { getAvatarCommand } from "../commands/getAvatar/chooseAvatar";

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
        )
];

// export command
export const commandHandlers: Record<string, (interaction: ChatInputCommandInteraction) => Promise<void>> = {
    help: helpCommand,
    random: randomCommand,
    avatar: getAvatarCommand
};
