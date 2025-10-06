import {footballClubCommand} from "./subcommand/footballClubCommand.js"
import {footballTournamentCommand} from "./subcommand/footballTournamentCommand.js"
import {footballScoreCommand} from "./subcommand/footballScoreCommand.js"
import {footballRankCommand} from "./subcommand/footballRankCommand.js"

export async function footballCommand(interaction){
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand){
        case 'club':
            await footballClubCommand(interaction);
            break
        case 'tournament':
            await footballTournamentCommand(interaction);
            break
        case 'score':
            await footballScoreCommand(interaction);
            break
        case 'rank':
            await footballRankCommand(interaction);
            break
        default:
            await interaction.reply({
                content: '❌ Subcommand không hợp lệ!',
                flags: 64
            });
    }
}