import { connectMongoDB } from "../commands/fit-hcmus-news/db/connect.js";
import { NewsMonitor } from '../commands/fit-hcmus-news/rss/newsMonitor.js';

export async function connectDBAndMonitorNews(client) {
    if (process.env.MONGO_URI) {
        await connectMongoDB();
        NewsMonitor(client);
        console.log('MongoDB connected and News Monitor started.');
    }
    else {
        console.log('MONGO_URI not found. Skipping MongoDB connection and News Monitor.');
    }
}