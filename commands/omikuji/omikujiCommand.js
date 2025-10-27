import { AttachmentBuilder } from 'discord.js';
import * as path from 'path';
import * as fs from 'fs';
import OpenAI from 'openai';

// const omikuji = [
//     { name: "Đại cát", message: "🌸 “Vạn sự như ý. Cầu gì được nấy. Hạnh phúc và thành công sẽ tìm đến bạn. Hãy cảm ơn cuộc đời và tiếp tục làm việc thiện.”" },
//     { name: "Trung cát", message: "🍀 “Con đường bạn đi tuy có thử thách, nhưng kết quả sẽ tốt đẹp. Nếu giữ lòng kiên nhẫn, may mắn sẽ theo bạn.”" },
//     { name: "Tiểu cát", message: "🌼 “Những điều nhỏ bé mang lại niềm vui lớn. Đừng xem thường bước đi chậm — kiên trì sẽ mang đến hạnh phúc.”" },
//     { name: "Cát", message: "🌿 “Cuộc sống bình yên là phước lành. Mọi việc đang tiến triển đúng hướng, hãy giữ lòng biết ơn và tiếp tục cố gắng.”" },
//     { name: "Bán cát", message: "🌻 “Sẽ có niềm vui đến, nhưng cần nỗ lực và cẩn trọng. Chuyện nhỏ làm nên việc lớn nếu bạn không vội vàng.”" },
//     { name: "Mạt cát", message: "🌙 “Hiện tại chưa thấy kết quả, nhưng tương lai sẽ sáng sủa. Hãy tin vào quá trình và đừng nản lòng.”" },
//     { name: "Mạt tiểu cát", message: "💫 “Cần kiên nhẫn thêm một thời gian. Khi cơ hội đến, hãy nắm bắt, đừng do dự.”" },
//     { name: "Bán hung", message: "☁️ “Có trở ngại nhỏ trong thời gian tới. Hãy bình tĩnh, tránh nóng nảy, và mọi chuyện sẽ dần qua.”" },
//     { name: "Tiểu hung", message: "🌧 “Khó khăn sẽ ghé qua nhưng không lâu. Nếu bạn giữ lòng tốt, vận may sẽ trở lại.”" },
//     { name: "Hung", message: "🌩 “Thời vận chưa thuận, hãy thận trọng trong lời nói và hành động. Tránh mạo hiểm, chờ thời cơ.”" },
//     { name: "Mạt hung", message: "⚡ “Tình hình có vẻ yên ổn nhưng tiềm ẩn rủi ro. Giữ tâm an, tránh tranh cãi, bạn sẽ vượt qua.”" },
//     { name: "Đại hung", message: "💀 “Đây là lúc thử thách lớn nhất. Nhưng khi vượt qua, bạn sẽ trưởng thành hơn. Đừng tuyệt vọng — sau cơn mưa, trời lại sáng.”" }
// ];

const omikuji = ["Đại cát", "Trung cát", "Tiểu cát", "Cát", "Bán cát", "Mạt cát", "Mạt tiểu cát", "Bán hung", "Tiểu hung", "Hung", "Mạt hung", "Đại hung"];


const topic = [
  "tình duyên",     // 恋愛 (ren’ai)
  "học hành",       // 学問 (gakumon)
  "công việc",      // 仕事 (shigoto)
  "tài vận",        // 金運 (kin'un)
  "sức khỏe",       // 健康 (kenkō)
  "hành trình",     // 旅行 (ryokō)
  "gia đạo",        // 家庭 (katei)
  "ước nguyện",     // 願望 (ganbō) - điều ước, mong muốn
  "mối quan hệ",    // 縁 (en) - duyên, quan hệ bạn bè/xã hội
  "phán đoán",      // 判断 (handan) - đưa ra quyết định, chọn lựa
  "thi cử",         // 試験 (shiken)
  "kinh doanh",     // 商売 (shōbai)
  "sự nghiệp",      // 出世 (shusse)
  "thời vận",       // 時運 (jiun) - vận khí tổng thể
  "tin tức",        // 便り (tayori) - tin, thông điệp sắp đến
  "vật bị mất"      // 失物 (ushinamono) - đồ vật thất lạc
];

async function responseOmikujiMessage(omikujiName, topic) {
    const client = new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1"
    });

    try {
        // const prompt = `
        // Bạn là một thầy bói giỏi trong lĩnh vực đưa ra các lời chúc của quẻ bói Omikuji. 
        // Hãy đưa ra lời dự đoán ý nghĩa của quẻ omikuji "${omikujiName}" bằng tiếng Việt.
        // Câu chúc chỉ cần nội dung chính cho quẻ omikuji đó, không cần ghi các câu dẫn ở đầu hoặc kết thúc
        // `;

        const prompt = `
Hãy viết một lời chúc theo phong cách của quẻ bói Omikuji Nhật Bản, tương ứng với quẻ "${omikujiName}" với trọng tâm chủ đề là ${topic}, bằng tiếng Việt.  
Yêu cầu:
- Giọng văn nhẹ nhàng, mang cảm giác huyền bí và cổ điển kiểu Nhật (như lời tiên tri hoặc khuyên nhủ).  
- Văn phong kiểu Nhật và theo hướng tự nhiên, không gượng ép.
- Độ dài dài dài một tí 6 tới 8 câu. Tối đa 500 từ.
- Nội dung phải phù hợp với ý nghĩa may rủi của quẻ: nếu là "Đại cát" thì rất may mắn, còn "Đại hung" thì nên cảnh báo nhẹ nhàng, khuyên cẩn trọng. Các quẻ khác cũng tương tư như vậy theo ý nghĩa của chúng.  
- Phải thể hiện rõ trọng tâm đó trong lời tiên tri và tập trung vào chủ đề đó.
- Không cần lời mở đầu là trọng tâm gì, quẻ bói này là gì hoặc kết thúc (như “chúc bạn...” hay “hãy tin tưởng...”), chỉ cần nội dung chính của lời tiên tri.  
- Không lặp lại tên quẻ trong nội dung. Không sử dụng các cụm từ như "theo quẻ bói Omikuji", "theo truyền thống Nhật Bản" hoặc "theo phong tục Nhật Bản". Dịch toàn bộ phần chúc ra tiếng Việt, không để từ tiếng Nhật nào trong lời chúc.
- Viết cho người đọc cảm thấy như đang nhận được lời khuyên quý giá từ một thầy bói uyên thâm chứ không phải từ một chatbot AI hoặc LLM nào đó.`;

        const completion = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        });

        return completion.choices[0]?.message?.content || "";
    }
    catch (error) {
        console.error("Lỗi khi gọi API Groq:", error);
        return "";
    }
}

function getImagePathForOmikuji(resultOmikujiIdx) {
    const assetsDir = path.join(path.resolve(), 'commands', 'omikuji', 'assets');
    const imageOmikuji = fs.readdirSync(assetsDir);
    const randomImage = imageOmikuji[resultOmikujiIdx];
    const imagePath = path.join(assetsDir, randomImage);

    return { imagePath, randomImage };
}

export async function omikujiCommand(interaction) {
    await interaction.deferReply();

    const resultOmikujiIdx = Math.floor(Math.random() * omikuji.length);
    const topicIdx = Math.floor(Math.random() * topic.length);

    const { imagePath, randomImage } = getImagePathForOmikuji(resultOmikujiIdx);
    const attachment = new AttachmentBuilder(imagePath, { name: randomImage });

    if (!process.env.GROQ_API_KEY) {
        await interaction.editReply("Vui lòng cung cấp API_KEY của Groq trong .env để sử dụng lệnh này");
        return;
    }

    const res = await responseOmikujiMessage(omikuji[resultOmikujiIdx], topic[topicIdx]);

    await interaction.editReply({
        files: [attachment],
        embeds: [
            {
                color: 0xFFD700,
                title: `🃏 Quẻ ${omikuji[resultOmikujiIdx]}`,
                author: {
                    name: `${interaction.user.username} ơi, quẻ Omikuji của bạn hôm nay là:`,
                    iconURL: interaction.user.displayAvatarURL()
                },
                description: "**Lời nhắn nhủ: **\n" +res,
                image: { url: `attachment://${randomImage}` },
                footer: {
                    text: 'おみくじ • Omikuji'
                },
            }
        ]
    });
}