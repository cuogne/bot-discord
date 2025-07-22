export const CINEMA_CONFIG = {
    location: 'Cinestar Sinh Viên - TP.HCM',
    baseURL: 'https://cinestar.com.vn/book-tickets/cf13e1ce-2c1f-4c73-8ce5-7ef65472db3c/',
    // baseURL: 'https://cinestar.com.vn/book-tickets/8f54df74-3796-42ea-896e-cd638eec1fe3/', // cinestar my tho
    apiImageURL: 'https://api-website.cinestar.com.vn',
};

// format file name: 'dd-mm-yyyy-detail-film.json', 'dd-mm-yyyy-name-film.json'
export const FILE_CONFIG = {
    dataDir: 'data', // folder contains data of film
    detailSuffix: '-detail-film.json',
    nameSuffix: '-name-film.json'
};