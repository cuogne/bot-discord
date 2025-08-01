import * as fs from 'fs';
import * as path from 'path'
import { fileURLToPath } from 'url';
import { getCurrentDate } from './getCurrentDate.js';

export function checkFileExists(fileName) {
    // get path of file
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const dataDir = path.join(__dirname, '..', 'data');

    let checkExists = true;
    const listFileName = fs.readdirSync(dataDir);

    if (!listFileName.includes(fileName)) {
        checkExists = false;
    }
    else {
        try {
            // check content
            const filePath = path.join(dataDir, fileName);
            const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            const dateInFile = fileContent.map(movie => movie['Ngày'])

            if (!dateInFile.every(date => date === getCurrentDate())) {
                checkExists = false;
            }
        }
        catch (error) {
            console.error(`Lỗi khi truy cập file: ${fileName}`)
            checkExists = false;
        }
    }

    return checkExists;
}