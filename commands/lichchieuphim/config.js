import { CINEMA } from "./constants.js"
import { setFileName } from "./utils/setFileName.js"
import { getCurrentDate } from "./utils/getCurrentDate.js"

export const linkAPIAllMovies = 'https://cinestar.com.vn/_next/data/zjibbkSvABB36IGGCTn3A/index.json'

export function getCinemaConfig(cinema) {
    return CINEMA.id_MovieTheater[cinema]
}

export function getFileConfig(cinema) {
    const CINEMA_CONFIG = getCinemaConfig(cinema);
    return {
        dataDir: 'data',
        fileName: setFileName(getCurrentDate()) + '-' + CINEMA_CONFIG.id_file + '-all-movies.json'
    }
}