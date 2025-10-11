import { Client, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';

import { initializeREST, registerCommands } from './handlers/initHandler';
import { handleInteractions } from './handlers/interactionHandler';
import { handleMessages } from './handlers/msgHandler';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const rest = initializeREST(process.env.BOT_TOKEN!);

client.once('ready', async () => {
    console.log(`Tên bot: ${client.user?.tag}!`);
    await registerCommands(client, rest);
});

client.on('interactionCreate', (interaction) => handleInteractions(interaction));
client.on('messageCreate', (message) => handleMessages(client, message));

client.login(process.env.BOT_TOKEN!);