import { ChatInputCommandInteraction } from "discord.js";
import { getAvatarUserCommand } from "./subcommand/avatarUser";
import { getAvatarServerCommand } from "./subcommand/avatarServer";

export async function getAvatarCommand(interaction: ChatInputCommandInteraction) {
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