import fs from 'fs';
import path from 'path';

const CONFIG_FILE = './commands/fit-hcmus-news/data/news-config.json';

export function loadConfig() {
    try {
        if (!fs.existsSync(CONFIG_FILE)) {
            const dir = path.dirname(CONFIG_FILE);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            return { servers: {} };
        }
        const data = fs.readFileSync(CONFIG_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error config:', error);
        return { servers: {} };
    }
}