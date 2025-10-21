import { connectMongoDB } from "../commands/fit-hcmus-news/db/connect.js";
import { sendNews } from '../commands/fit-hcmus-news/main/sendNews.js';

export async function connectDBAndMonitorNews(client) {
    if (process.env.MONGO_URI) {
        await connectMongoDB();
        sendNews(client);
        console.log('MongoDB connected and News Monitor started.');
    }
    else {
        console.log('MONGO_URI not found. Skipping MongoDB connection and News Monitor.');
    }
}