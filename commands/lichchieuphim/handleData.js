import { linkAPIAllMovies } from './config.js';
import { getCurrentDate } from './utils/getCurrentDate.js';
import * as fs from 'fs';
import * as path from 'path'

export async function fetchAndProcessMovieData(CINEMA_CONFIG, FILE_CONFIG) {
    const currentDate = getCurrentDate() // change from global variable -> scope variable (fixed bug)
    const __dirname = path.dirname(new URL(import.meta.url).pathname);  // lay duong dan thu muc hien tai cua file
    const dataDir = path.join(__dirname, 'data');                       // duong dan thu muc data (test/data)

    // fetch api lay data ve json
    const response = await fetch(linkAPIAllMovies);
    const data = await response.json();

    // tao thu muc data neu chua co
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    const idMovies = data.pageProps?.res?.listMovie.map(movie => movie.id) || [];

    const day = getCurrentDate().split('/')[0] // lay ngay (day)
    // let listDataMovies = []

    // using promise to fetch data in parallel
    const movieDataPromises = idMovies.map(async (id_movie) => {
        const url = `https://cinestar.com.vn/api/showTime/?id_Movie=${id_movie}&id_Area=${CINEMA_CONFIG.id_area}&id_Server=${CINEMA_CONFIG.id_server}&date=${day}&id_MovieTheater=${CINEMA_CONFIG.uuid}`;
        const response = await fetch(url);
        const dataMovie = await response.json();

        // update condition
        if (dataMovie.data &&
            dataMovie.data.length > 0 &&
            dataMovie.data[0].id != null) {
            return dataMovie;
        }
        return null;
    });

    const movieDataResults = await Promise.all(movieDataPromises);
    const listDataMovies = movieDataResults.filter(dataMovie => dataMovie !== null);

    const result = []

    for (const dataMovie of listDataMovies) {
        const dataArr = dataMovie.data || [];

        for (const movie of dataArr) {
            const scheduleArr = movie.schedule || [];

            for (const sch of scheduleArr) {
                if (sch.date !== currentDate) continue;
                const allTimes = [];

                for (const t of sch.times) {
                    allTimes.push({
                        time: t.time,
                        showtime_id: t.showtime_id
                    });
                }

                if (allTimes.length > 0) {
                    const timesStr = allTimes.map(t => t.time).join(',');
                    const showtimeId = allTimes[0]?.showtime_id || '';
                    result.push({
                        "Tên phim": movie.name_vn,
                        "Ngày": currentDate,
                        "Giờ chiếu": timesStr,
                        "Link ảnh": movie.image,
                        "Link đặt vé": `https://cinestar.com.vn/movie/${movie.id}/?id=${CINEMA_CONFIG.id_area}&id_sv=${CINEMA_CONFIG.id_server}&show_time=${showtimeId}&date=${currentDate}`,
                        "genre": movie.type_name_vn,
                        "minute": movie.time_m,
                        "country": movie.country_name_vn,
                        "format_language": movie.language_vn,
                        "brief": movie.brief_vn,
                        "trailer": movie.trailer ? `https://youtu.be/${movie.trailer}` : null
                    });
                }
            }
        }
    }

    const outputFilePath = path.join(dataDir, FILE_CONFIG.fileName);
    fs.writeFileSync(outputFilePath, JSON.stringify(result, null, 2), 'utf8');

    const gitkeepPath = path.join(dataDir, '.gitkeep');
    if (!fs.existsSync(gitkeepPath)) {
        fs.writeFileSync(gitkeepPath, '');
    }
}