import { CINEMA } from './cinema-config'
import { setFileName } from '../utils/setFileName';
import { getToday } from '../utils/getToday';

export function getCinema(cinema: string) {
    return CINEMA.id_MovieTheater[cinema]
}

export function getFileName(cinema: string) {
    const CINEMA_CONFIG = getCinema(cinema);

    // format: yyyy-mm-dd-idcinema.json
    return `${setFileName(getToday())}-${CINEMA_CONFIG.id_file}.json`
}