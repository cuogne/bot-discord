import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

export function checkFile(fileName) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const dataDir = path.join(__dirname, '..', 'data');

    let checkExists = true;
    const listFileName = fs.readdirSync(dataDir);

    if (!listFileName.includes(fileName)) {
        checkExists = false;
    }
    return checkExists;
}