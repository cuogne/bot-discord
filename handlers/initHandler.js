import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
import { commands } from '../config/config-command.js';

export function initializeREST(token) {
    return new REST({ version: '10' }).setToken(token);
}

export async function registerCommands(client, rest) {
    try {
        await rest.put(Routes.applicationCommands(client.user.id), {
            body: commands
        });
        console.log('Slash commands are ready!');
    } catch (error) {
        console.error('Lỗi khi đăng ký commands:', error);
    }
}