import { CINEMA } from "./constants.js"
import { setFileName } from "./utils/setFileName.js"
import { getCurrentDate } from "./utils/getCurrentDate.js"

export const linkAPIAllMovies = 'https://cinestar.com.vn/_next/data/jZniZUx-s1ODigQHrqyik/index.json'
export const CINEMA_CONFIG = CINEMA.id_MovieTheater['Cinestar Sinh Viên - TP.HCM']

// ten file: dd-mm-yyyy-idArea-all-movies.json
export const FILE_CONFIG = {
    'dataDir': 'data',
    'fileName': setFileName(getCurrentDate()) + '-' + CINEMA_CONFIG.id_file + '-all-movies.json'
}