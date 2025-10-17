import axios from 'axios';

export async function getLinkAPI(){
    try {
        const response = await axios.get('https://cinestar.com.vn/book-tickets')
        const html = response.data
        const match = html.match(/"buildId":"([^"]+)"/)
        
        if (!match) {
            throw new Error('buildId not found in HTML')
        }

        const id = match[1]
        const linkApi = `https://cinestar.com.vn/_next/data/${id}/index.json`

        // console.log(linkApi)
        return linkApi

    }
    catch (error) {
        console.error('Lỗi khi lấy link api', error.message)
    }
}