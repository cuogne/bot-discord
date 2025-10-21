import { schema, SentNews } from "../db/newSchema.js";
import { getListNews } from "./getListNews.js";

export async function sendNews(client) {
    // setInterval(async () => {
    try {
        const listNews = await getListNews(); // [{ category, title, url }, ...]
        // const listNews = [
        //     {
        //         "category": "fithcmus",
        //         "title": "Thông báo về việc đăng ký đề tài tốt nghiệp dành cho học viên cao học khoá 34/2024 - đợt 2",
        //         "url": "https://www.fit.hcmus.edu.vn/vn/Default.aspx?tabid=292&newsid=17015"
        //     },
        //     {
        //         "category": "lichthi",
        //         "title": "Lịch thi HK1/25-26 hệ ĐTTX",
        //         "url": "http://ktdbcl.hcmus.edu.vn/index.php/cong-tac-kh-o-thi/l-ch-thi-h-c-ky/909-l-ch-thi-hk1-25-26-h-dttx"
        //     },
        //     {
        //         "category": "thongbao",
        //         "title": "Thông báo khảo sát sự hài lòng VC-NLĐ về các hoạt động hỗ trợ của trường năm 2025",
        //         "url": "http://ktdbcl.hcmus.edu.vn/index.php/thong-bao/910-thong-bao-kh-o-sat-s-hai-long-vc-nld-v-cac-ho-t-d-ng-h-tr-c-a-tru-ng-nam-2025"
        //     },
        //     {
        //         "category": "hcmus",
        //         "title": "Thông báo tổ chức Chuyên đề “Nhận diện thủ đoạn lừa đảo công nghệ cao – bảo vệ bản thân trên không gian mạng”",
        //         "url": "https://hcmus.edu.vn/thong-bao-to-chuc-chuyen-de-nhan-dien-thu-doan-lua-dao-cong-nghe-cao-bao-ve-ban-than-tren-khong-gian-mang/"
        //     }
        // ]

        if (!Array.isArray(listNews) || listNews.length === 0) return;

        // load config user
        const configs = await schema.find({ isActive: true }).lean();
        if (!configs.length) return;

        for (const cfg of configs) {
            const guild = client.guilds.cache.get(cfg.guildId);
            const channel = guild?.channels.cache.get(cfg.channelId);
            if (!channel) continue;

            const filteredNews = cfg.categories?.length
                ? listNews.filter((n) => cfg.categories.includes(n.category))
                : listNews;

            for (const news of filteredNews) {
                try {
                    const last = await SentNews.findOne({ category: news.category });

                    if (last && last.url === news.url) continue;

                    // gửi tin
                    await channel.send(
                        `📰 | **${news.title}**\n\n${news.url}`
                    );

                    await SentNews.findOneAndUpdate(
                        { category: news.category },
                        { title: news.title, url: news.url },
                        { upsert: true, new: true }
                    );

                } catch (err) {
                    console.error("Error sending or saving news:", err);
                }
            }
        }
    } catch (error) {
        console.error("sendNews error:", error);
    }
    // }, 1000 * 60 * 10); // 10 phút/lần
}