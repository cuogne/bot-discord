import * as fs from 'fs';
import * as path from 'path'
import { getToday } from '../utils/getToday.js';

export function checkFileExists(fileName) {
    // get path of file
    const projectRoot = path.resolve();
    const dataDir = path.join(projectRoot, 'commands', 'cinestar', 'data');

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

            const dateInFile = fileContent.map(movie => movie['Ngày']);
            if (dateInFile.some(date => date !== getToday())) {
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