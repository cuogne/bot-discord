import { latestSubCommand } from './subcommand/latestSubCommand.js'

export async function fitNewsCommand(interaction) {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
        case 'latest':
            await latestSubCommand(interaction);
            break;

        // case 'setup':
        //     await handleSetupChannel(interaction);
        //     break;

        // case 'remove':
        //     await handleRemoveChannel(interaction);
        //     break;

        // case 'status':
        //     await handleStatusChannel(interaction);
        //     break;

        default:
            await interaction.reply({
                content: '❌ Subcommand không hợp lệ!',
                ephemeral: true
            });
    }
}