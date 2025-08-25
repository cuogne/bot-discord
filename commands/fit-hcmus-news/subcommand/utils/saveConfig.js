import fs from 'fs';
import path from 'path';

const CONFIG_FILE = './commands/fit-hcmus-news/config-channel/news-config.json';

export function saveConfig(config) {
    try {
        const dir = path.dirname(CONFIG_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
        return true;
    } catch (error) {
        console.error('Error save config:', error);
        return false;
    }
}