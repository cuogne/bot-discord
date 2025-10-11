import { Interaction, ChatInputCommandInteraction } from 'discord.js';
import { commandHandlers } from '../config/config-command';

export async function handleInteractions(interaction: Interaction): Promise<void> {
    try {
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
    } catch (error) {
        console.error('Error handling interaction:', error);
        if (interaction.isChatInputCommand()) {
            if (!interaction.replied && !interaction.deferred) {
                try {
                    await interaction.reply({
                        content: 'Có lỗi xảy ra khi xử lý command!',
                        ephemeral: true
                    });
                } catch (replyError) {
                    console.error('Error replying to interaction:', replyError);
                }
            }
        }
    }
}
