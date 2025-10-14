import { getAvatarUserCommand } from "./subcommand/avatarUser.js";
import { getAvatarServerCommand } from "./subcommand/avatarServer.js";

export async function getAvatarCommand(interaction) {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
        case 'user': {
            await getAvatarUserCommand(interaction);
            return;
        }
        case 'server': {
            await getAvatarServerCommand(interaction);
            return
        }
        default: {
            await interaction.reply('Subcommand not found');
            return;
        }
    }
}