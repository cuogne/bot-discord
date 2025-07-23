/*
NOTE: This file uses ESM (import/export). If your project does NOT include "type": "module" in package.json, 
you must use require(...) instead of import.
*/

import { Client, GatewayIntentBits, Events } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Event: Bot is ready
client.once(Events.ClientReady, () => {
    console.log(`✅ Bot has successfully logged in as: ${client.user.tag}`);
});

// Event: Message received
client.on(Events.MessageCreate, message => {
    // Ignore messages from bots
    if (message.author.bot) return;

    if (message.content.toLowerCase() === '!ping') {
        message.reply('🏓 Pong!');
    }

    if (message.content.toLowerCase() === '!help') {
        message.reply('📄 Available commands: `!ping`, `!help`');
    }
});

// Log in the bot using the token from .env
client.login(process.env.DISCORD_TOKEN);