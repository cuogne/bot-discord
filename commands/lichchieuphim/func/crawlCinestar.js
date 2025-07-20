import puppeteer from 'puppeteer';
import * as cheerioModule from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import { setFilename } from './setFilename.js';
import { CINEMA_CONFIG, FILE_CONFIG } from '../constants.js';

export async function crawlCinestar() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(CINEMA_CONFIG.baseURL, { waitUntil: 'networkidle2' });

    const $ = cheerioModule.load(await page.content());
    const today = new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const todaySchedule = [];

    $('.movies-content').each((i, movie) => {
        // thong tin poster trong the div.movies-img
        const posterImg = $(movie).prev('.movies-img').find('img').first();

        let imageUrl = posterImg.attr('src') || '';

        // Kiểm tra và tạo full URL nếu cần
        if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = CINEMA_CONFIG.apiImageURL + imageUrl;
        }

        // thong tin phim trong the h3.movies-name
        const movieName = $(movie).find('h3.movies-name').text().trim();
        const attrs = $(movie).find('ul li').map((i, li) => $(li).text()).get();

        $(movie).find('.movies-rp-block').each((j, dayBlock) => {
            const dayText = $(dayBlock).find('span.txt').text().trim();
            const dateStr = dayText.includes(',') ? dayText.split(',')[1].trim() : dayText.trim();

            if (dateStr === today) {
                $(dayBlock).find('p.movies-rp-title').each((k, roomType) => {
                    const roomName = $(roomType).text().trim();
                    const times = $(roomType).nextAll('div.movies-time').first()
                        .find('a.movies-time-item').map((l, item) => $(item).text().trim()).get();

                    todaySchedule.push({
                        "Tên phim": movieName,
                        "Ngày": dateStr,
                        "Loại phòng": roomName,
                        "Giờ chiếu": times.join(','),
                        "Link ảnh": imageUrl,
                        genre: attrs[0] || "",
                        minute: attrs[1] || "",
                        country: attrs[2] || "",
                        format_language: attrs[3] || "",
                        notes: attrs[4] || ""
                    });
                });
            }
        });
    });

    // Lưu file...
    const nowDate = new Date();
    const dateStr = nowDate.toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh'
    }).split(" ")[1];

    // const solarDate = dateStr[1];
    const safeFilename = setFilename(dateStr);

    const currentDir = path.dirname(import.meta.url.replace('file://', ''));
    const dataDir = path.join(currentDir, '..', FILE_CONFIG.dataDir);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    const uniqueMovieNames = [...new Set(todaySchedule.map(movie => movie["Tên phim"]))];

    fs.writeFileSync(path.join(dataDir, `${safeFilename}${FILE_CONFIG.detailSuffix}`), JSON.stringify(todaySchedule, null, 2));
    fs.writeFileSync(path.join(dataDir, `${safeFilename}${FILE_CONFIG.nameSuffix}`), JSON.stringify(uniqueMovieNames, null, 2));
    fs.writeFileSync(path.join(dataDir, '.gitkeep'), '');

    await browser.close();
} 