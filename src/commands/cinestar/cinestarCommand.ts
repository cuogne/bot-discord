import { ChatInputCommandInteraction } from "discord.js";
import { cinestarTodayCommand } from './main/cinestarTodayCommand'
import { cinestarUpcomingMoviesCommand } from './main/cinestarUpcomingMoviesCommand'

export async function cinestarCommand(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
        case 'today': {
            await cinestarTodayCommand(interaction);
            break;
        }
        case 'upcoming': {
            await cinestarUpcomingMoviesCommand(interaction);
            break;
        }
        default: {
            await interaction.reply("Lệnh không hợp lệ. Vui lòng thử lại.");
        }
    }
}