import { latestSubCommand } from './subcommand/latestSubCommand.js'
import { setupChannelSubCommand } from './subcommand/setupChannelSubCommand.js'
import { statusChannelSubCommand } from "./subcommand/statusChannelSubCommand.js";
import { removeChannelSubCommand } from "./subcommand/removeChannelSubCommand.js";

export async function fitNewsCommand(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (!process.env.MONGODB_URI && ['setup', 'remove', 'status'].includes(subcommand)) {
        await interaction.reply({
            content: "Vui lòng thiết lập biến môi trường MONGODB_URI trong file .env để sử dụng lệnh này.",
            flags: 64
        });
        return;
    }

    switch (subcommand) {
        case 'latest':
            await latestSubCommand(interaction);
            break;

        case 'setup':
            await setupChannelSubCommand(interaction);
            break;

        case 'remove':
            await removeChannelSubCommand(interaction);
            break;

        case 'status':
            await statusChannelSubCommand(interaction);
            break;

        default:
            await interaction.reply({
                content: '❌ Subcommand không hợp lệ!',
                ephemeral: true
            });
    }
}