import { replyBot } from '../utils/msgReply.js';

export function handleMessages(client, message) {
    if (message.author.bot) return;

    // @bot (tag bot)
    if (message.mentions.has(client.user)) {
        message.reply(replyBot());
        message.react('😡');
    }
}