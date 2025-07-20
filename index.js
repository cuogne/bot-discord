import { Client, GatewayIntentBits, Routes } from 'discord.js';
import { REST } from '@discordjs/rest';
import 'dotenv/config';

import { commands, commandHandlers } from './commands/config/config-command.js';

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
    console.log('Đăng ký thành công slash commands');
});

// handle slash command
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const handler = commandHandlers[interaction.commandName];

    if (handler) {
        await handler(interaction);
    } else {
        await interaction.reply({
            content: 'Lệnh không tồn tại!',
            flags: 64
        });
    }
});

// handle string select menu (dropdown) for /lichchieuphim
client.on('interactionCreate', async interaction => {
    if (!interaction.isStringSelectMenu()) return;

    if (interaction.customId === 'select_movie') {
        const { handleMovieSelection } = await import('./commands/lichchieuphim/handleInteraction.js');
        await handleMovieSelection(interaction);
    }
});

const listMsgReplyForBot = ["Ping cai con di me may", "Ping con cac", "Ping lam deo gi", "Ping gi ku"]
const replyBot = (list) => {
    // const index = 3
    const index = Math.floor(Math.random() * list.length)
    return list[index]
}

client.on('messageCreate', message => {
    if (message.author.bot) return; // bo qua chat cua bot

    // if (message.content.toLowerCase() === 'hello') {
    //     message.reply('Lo con cac tao');
    //     message.react('😀');
    // }

    // mention bot
    if (message.mentions.has(client.user)) {
        message.reply(replyBot(listMsgReplyForBot))
    }
});

client.login(process.env.BOT_TOKEN);
