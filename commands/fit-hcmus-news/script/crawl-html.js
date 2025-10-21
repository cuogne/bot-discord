import axios from 'axios';
import * as cheerio from 'cheerio';

export async function crawlHTMLNews(link, category){
    try {
        const response = await axios.get(link);
        const html = response.data;
        const $ = cheerio.load(html);
        
        const articles = [];
        
        // class "content entry" -> article -> title links
        // $('.content.entry .cmsmasters_archive_item_title.entry-title a').each((index, element) => {
        //     const title = $(element).text().trim();
        //     const url = $(element).attr('href');
            
        //     articles.push({ 
        //         title,
        //         url
        //     });
        // });
        
        const element = $('.content.entry .cmsmasters_archive_item_title.entry-title a').first();
        const title = element.text().trim();
        const url = element.attr('href');

        articles.push({ 
            category,
            title,
            url
        });

        return articles;
        
        // fs.writeFileSync('hcmus-articles.json', JSON.stringify(articles, null, 2));
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

