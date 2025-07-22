import * as fs from 'fs';
import * as path from 'path'
import { getCurrentDate } from './getCurrentDate.js'
import { setFileName } from './setFileName.js';
import { fileURLToPath } from 'url';
import { CINEMA_CONFIG } from '../config.js';

export function checkFileExists() {
    // dd-mm-yyyy-idArea-all-movies.json (22-07-2025-sv-all-movies.json)
    const dateNow = getCurrentDate(); // 22/07/2025
    const startFileName = setFileName(dateNow); // 22-07-2025
    const idArea = CINEMA_CONFIG.id_file; // sv

    // => startFileName + idArea
    const dayFileName = startFileName + '-' + idArea;

    // get path of file
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const dataDir = path.join(__dirname, '..', 'data');

    // check file exists
    const infoMovie = path.join(dataDir, `${dayFileName}-all-movies.json`);

    let checkExists = true;
    if (!fs.existsSync(infoMovie)) {
        checkExists = false;
    }

    return checkExists;
}