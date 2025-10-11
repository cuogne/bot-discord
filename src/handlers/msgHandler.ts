import { Client, Message } from "discord.js";
import { replyBot } from "../utils/msgReply.js";

export function handleMessages(client: Client, message: Message) {
    if (message.author.bot) return;

    // tag bot
    if (message.mentions.has(client.user!)) {
        message.reply(replyBot());
        message.react("😡");
    }
}