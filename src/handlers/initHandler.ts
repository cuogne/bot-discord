import { REST } from '@discordjs/rest';
import { Routes, Client } from 'discord.js';
import { commands } from '../config/config-command';

export function initializeREST(token: string): REST {
    return new REST({ version: '10' }).setToken(token);
}

export async function registerCommands(client: Client, rest: REST): Promise<void> {
    try {
        await rest.put(Routes.applicationCommands(client.user!.id), {
            body: commands
        });
        console.log('Slash commands are ready!');
    } catch (error) {
        console.error('Lỗi khi đăng ký commands:', error);
    }
}