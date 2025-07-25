import { Client, GatewayIntentBits, Routes } from 'discord.js';
import { REST } from '@discordjs/rest';
import 'dotenv/config';

import { commands, commandHandlers, handleSelection } from './commands/config/config-command.js';
import { replyBot } from './utils/msgReply.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

// notice
client.once('ready', async () => {
    console.log(`Tên bot: ${client.user.tag}!`);

    await rest.put(Routes.applicationCommands(client.user.id), {
        body: commands
    });
    console.log('Slash commands are ready!');
});

// handle interactions
client.on('interactionCreate', async interaction => {
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
        // maybe fix if have more selectMenu from dropdown
        const [id, nameCinema] = interaction.customId.split('|')
        const handler = handleSelection[id];
        if (handler) {
            await handler(interaction, nameCinema);
        }
        else {
            await interaction.reply({
                content: 'Invalid selection!',
                flags: 64
            });
        }
    }
});

client.on('messageCreate', message => {
    if (message.author.bot) return; // bo qua chat cua bot

    // if (message.content.toLowerCase() === 'hello') {
    //     message.reply('Lo con cac tao');
    //     message.react('😀');
    // }

    // mention bot
    if (message.mentions.has(client.user)) {
        message.reply(replyBot())
        message.react('😡')
    }
});

client.login(process.env.BOT_TOKEN);
