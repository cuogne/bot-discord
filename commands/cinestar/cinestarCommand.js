import { cinestarTodayCommand } from './main/cinestarTodayCommand.js'
import { cinestarUpcomingMoviesCommand } from './main/cinestarUpcomingMoviesCommand.js'

export async function cinestarCommand(interaction) {
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