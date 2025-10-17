import { getToday } from "../utils/getToday.js";
import { getLinkAPI } from "./get-link-api.js";
import * as path from 'path';
import * as fs from 'fs';

export async function getDataMovie(cinema, fileName){
    const projectRoot = path.resolve();
    const dataDir = path.join(projectRoot, 'commands', 'cinestar', 'data');

    const today = getToday();
    const day = today.split('/')[0];

    const idMovies = await fetchMoviesID();
    const movieDataPromises = idMovies.map(id => fetchMovieData(id, cinema, day));
    const movieDataResults = await Promise.all(movieDataPromises);
    const listDataMovies = movieDataResults.filter(dataMovie => dataMovie !== null);

    const result = listDataMovies.flatMap(dataMovie => processMovieData(dataMovie, today, cinema));
    writeToFile(result, fileName, dataDir);

    return result;
}

async function fetchMoviesID() {
    const apiUrl = await getLinkAPI() || '';
    const response = await fetch(apiUrl);
    const data = await response.json();
    return (data && data.pageProps && data.pageProps.res && data.pageProps.res.listMovie)
        ? data.pageProps.res.listMovie.map(movie => movie.id)
        : [];
}

async function fetchMovieData(id_movie, cinema, day) {
    const url = `https://cinestar.com.vn/api/showTime/?id_Movie=${id_movie}&id_Area=${cinema.id_area}&id_Server=${cinema.id_server}&date=${day}&id_MovieTheater=${cinema.uuid}`;
    const response = await fetch(url);
    const dataMovie = await response.json();
    
    if (dataMovie && dataMovie.data && dataMovie.data.length > 0 && dataMovie.data[0].id != null) {
        return dataMovie;
    }
    return null;
}

// Process movie data into formatted result
function processMovieData(dataMovie, today, cinema) {
    const result = [];
    const dataArr = (dataMovie && dataMovie.data) ? dataMovie.data : [];

    for (const movie of dataArr) {
        const scheduleArr = movie.schedule || [];

        for (const sch of scheduleArr) {
            if (sch.date !== today) continue;
            
            const allTimes = (sch.times || []).map(t => ({
                time: t.time,
                showtime_id: t.showtime_id
            }));

            if (allTimes.length > 0) {
                const timesStr = allTimes.map(t => t.time).join(',');
                const showtimeId = allTimes[0] && allTimes[0].showtime_id ? allTimes[0].showtime_id : '';
                result.push({
                    "Tên phim": movie.name_vn,
                    "Ngày": today,
                    "Giờ chiếu": timesStr,
                    "Link ảnh": movie.image,
                    "Link đặt vé": `https://cinestar.com.vn/movie/${movie.id}/?id=${cinema.id_area}&id_sv=${cinema.id_server}&show_time=${showtimeId}&date=${today}`,
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
    return result;
}

// Write data to file and ensure .gitkeep exists
function writeToFile(data, fileName, dataDir) {
    const outputFilePath = path.join(dataDir, fileName);
    fs.writeFileSync(outputFilePath, JSON.stringify(data, null, 2), 'utf8');

    const gitkeepPath = path.join(dataDir, '.gitkeep');
    if (!fs.existsSync(gitkeepPath)) {
        fs.writeFileSync(gitkeepPath, '');
    }
}