import { CINEMA } from './cinema.js';
import { setFileName } from '../utils/setFileName.js';
import { getToday } from '../utils/getToday.js';
import * as fs from 'fs'
import * as path from 'path'

export function getCinema(cinema) {
    return CINEMA.id_MovieTheater[cinema]
}

export function getFileName(cinema) {
    const CINEMA_CONFIG = getCinema(cinema);

    // format: yyyy-mm-dd-idcinema.json
    return `${setFileName(getToday())}-${CINEMA_CONFIG.id_file}.json`
}

export function getDataDir(){
    return path.join(path.resolve(), 'commands', 'cinestar', 'data');
}