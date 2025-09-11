import axios from 'axios';

export async function getApiCinestar(){
    try {
        const response = await axios.get('https://cinestar.com.vn/book-tickets')
        const html = response.data
        const id = html.match(/"buildId":"([^"]+)"/)[1]
        const linkApi = `https://cinestar.com.vn/_next/data/${id}/index.json`

        // console.log(linkApi)
        return linkApi

    }
    catch (error) {
        console.error('Lỗi khi lấy link api', error.message)
    }
}