import { CINEMA } from "./constants.js"
import { setFileName } from "./utils/setFileName.js"
import { getCurrentDate } from "./utils/getCurrentDate.js"
import { getApiCinestar } from "../../utils/getApiCinestar.js"

export const linkAPIAllMovies = await getApiCinestar()

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