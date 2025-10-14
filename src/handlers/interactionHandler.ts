import { commandHandlers, handleSelection } from '../config/config-command.js';
import { Interaction, StringSelectMenuInteraction } from 'discord.js';

export async function handleInteractions(interaction: Interaction) {
    // handle slash commands
    if (interaction.isChatInputCommand()) {
        const handler = commandHandlers[interaction.commandName];
        if (handler) {
            await handler(interaction);
        } else {
            await interaction.reply({
                content: 'Command does not exist!',
                flags: 64
            });
        }
        return;
    }

    // handle string select menu (dropdown)
    if (interaction.isStringSelectMenu()) {
        // fix for more selection from dropdown
        if (interaction.customId.startsWith('select_movie')) { // select_movie|${cinema.name}
            const [id, nameCinema] = interaction.customId.split('|')
            const handler = handleSelection[id as keyof typeof handleSelection];
            if (handler) {
                await handler(interaction as any, nameCinema);
            }
            else {
                await interaction.reply({
                    content: 'Invalid selection!',
                    flags: 64
                });
            }
        }
        else if (interaction.customId.startsWith('select_movie_cgv')) { // select_movie_cgv|${province}|${cinemaName}
            // const handler = handleSelection['select_movie_cgv'];
            // if (handler) {
            //     await handler(interaction);
            // }
            await interaction.reply({
                content: 'CGV selection not implemented yet!',
                flags: 64
            });
        }
        else {
            const handler = handleSelection[interaction.customId as keyof typeof handleSelection];
            if (handler) {
                const [id, nameCinema] = interaction.customId.split('|');
                await handler(interaction as any, nameCinema || '');
            }
            else {
                await interaction.reply({
                    content: 'Invalid selection!',
                    flags: 64
                });
            }
        }
    }
}