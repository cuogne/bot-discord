import * as fs from 'fs';
import * as path from 'path'
import { getToday } from '../utils/getToday';

interface Movie {
    Ngày: string;
    [key: string]: any;
}

export function checkFileExists(fileName: string) {
    // get path of file
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

            const dateInFile: string[] = (fileContent as Movie[]).map((movie: Movie) => movie['Ngày']);
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