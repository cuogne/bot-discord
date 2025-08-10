import * as fs from 'fs'
import { formatDay } from './utils/formatDay.js'
import { getCurrentDate } from './utils/getCurrentDate.js'

export async function getData(id_cinema, fileName) {
    const link = `https://www.cgv.vn/default/cinemas/catalog_mobile/siteschedules/id/${id_cinema}`
    const dataDir = 'commands/cgv/data'

    try {
        const response = await fetch(link)
        const data = await response.json()

        const processedData = processData(data)

        fs.writeFileSync(`${dataDir}/${fileName}`, JSON.stringify(processedData, null, 2))

        const gitkeepPath = `${dataDir}/.gitkeep`
        if (!fs.existsSync(gitkeepPath)) {
            fs.writeFileSync(gitkeepPath, '')
        }

        return processedData
    }
    catch (error) {
        console.error('Error fetching data:', error)
        return null
    }
}

function processData(apiData) {
    const result = []

    if (apiData.data && apiData.data.length > 0) {
        const dateData = apiData.data[0]
        const date = dateData.date
        const movies = dateData.movies

        if (!date || formatDay(date) != getCurrentDate()) {
            return result;
        }

        movies.forEach(movie => {
            const movieInfo = {
                "Tên phim": movie.name,
                "Tên rạp": movie.languages[0].sessions[0].theater,
                "Ngày": date,
                "Thời lượng": `${movie.movie_endtime} phút`,
                "id_film": movie.id,
                "id_sku": movie.sku,
                "link_posterImg": movie.thumbnail,
                "Loại phòng": {}
            }

            movie.languages.forEach(language => {
                const roomType = language.name
                const times = language.sessions.map(session => session.time)
                movieInfo["Loại phòng"][roomType] = times
            })

            result.push(movieInfo)
        })
    }

    return result
}