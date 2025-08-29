import { Client, GatewayIntentBits, Routes } from 'discord.js';
import { REST } from '@discordjs/rest';
import 'dotenv/config';

import { commands, commandHandlers, handleSelection } from './commands/config/config-command.js';
import { CGVTheater } from './commands/cgv/CGVTheater.js';
import { replyBot } from './utils/msgReply.js';

// for fit-hcmus-news
import { connectMongoDB } from "./commands/fit-hcmus-news/db/connect.js";
import { NewsMonitor } from './commands/fit-hcmus-news/rss/newsMonitor.js';

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

    // for fit-hcmus-news
    await connectMongoDB();
    NewsMonitor(client);
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
        // fix for more selection from dropdown
        if (interaction.customId.startsWith('select_movie')) { // select_movie|${CINEMA_CONFIG.name}
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
        else if (interaction.customId.startsWith('select_movie_cgv')) { // select_movie_cgv|${province}|${cinemaName}
            const handler = handleSelection['select_movie_cgv'];
            if (handler) {
                await handler(interaction);
            }
            else {
                await interaction.reply({
                    content: 'Invalid selection!',
                    flags: 64
                });
            }
        }
        else {
            const handler = handleSelection[interaction.customId];
            if (handler) {
                await handler(interaction);
            }
            else {
                await interaction.reply({
                    content: 'Invalid selection!',
                    flags: 64
                });
            }
        }
    }

    // handle autocomplete(dependent options for /cgv)
    if (interaction.isAutocomplete()) {
        try {
            if (interaction.commandName !== 'cgv') return;

            const focusedOption = interaction.options.getFocused(true);
            const query = (focusedOption?.value || '').toLowerCase();

            // get province
            if (focusedOption.name === 'province') {
                const provinces = Object.keys(CGVTheater);
                const choices = provinces
                    .filter(provinceName => provinceName.toLowerCase().includes(query))
                    .slice(0, 25)
                    .map(provinceName => ({ name: provinceName, value: provinceName }));
                await interaction.respond(choices);
                return;
            }

            // get cinema (filtered by selected province)
            if (focusedOption.name === 'cinema') {
                const selectedProvince = interaction.options.getString('province');
                let cinemaNames = [];

                if (selectedProvince && CGVTheater[selectedProvince]) {
                    cinemaNames = Object.keys(CGVTheater[selectedProvince]);
                } else {
                    cinemaNames = Object.values(CGVTheater).flatMap(
                        provinceGroup => Object.keys(provinceGroup)
                    );
                }

                const choices = cinemaNames
                    .map(name => name.trim())
                    .filter(name => name.toLowerCase().includes(query))
                    .slice(0, 25)
                    .map(name => ({ name, value: name }));

                await interaction.respond(choices);
                return;
            }
        } catch (error) {
            console.error('Autocomplete error:', error);
        }
        return;
    }
});

client.on('messageCreate', message => {
    if (message.author.bot) return; // bo qua chat cua bot

    // mention bot
    if (message.mentions.has(client.user)) {
        message.reply(replyBot())
        message.react('😡')
    }
});

client.login(process.env.BOT_TOKEN);
