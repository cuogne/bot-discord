import { EmbedBuilder } from 'discord.js';

export async function helpCommand(interaction) {
    const listCommand = {
        '/avatar `[user]`': 'Lấy avatar của người được chọn',
        '~~/cgv `[province]` `[cinema]`~~': '~~Xem lịch chiếu phim hôm nay tại CGV~~ (không hoạt động)',
        '/cinestar `[cinema]`': 'Xem lịch chiếu phim trong ngày tại các rạp Cinestar trên toàn quốc',
        '/date': 'Xem ngày giờ hiện tại (dương lịch và âm lịch)',
        '/dictionary `[text]`': 'Tra cứu từ vựng tiếng Anh',
        '/fit-hcmus-news `[setup | latest | status | remove]`': 'Nhận thông báo tin tức mới nhất từ FIT-HCMUS',
        '/football_club `[club]`': 'Xem lịch thi đấu bóng đá của một số câu lạc bộ châu Âu',
        '/football_tournament `[tournament]`': 'Xem lịch thi đấu bóng đá của các giải đấu châu Âu',
        '/football_score': 'Xem tỉ số của các trận đấu bóng đá đêm qua và rạng sáng nay',
        '/gay `[user]`': 'Lòng tôi tan nát khi nhận ra tôi là ...',
        '/help': 'Hiển thị các thông tin cơ bản về bot cũng như command',
        '/image `[dog | cat]`': 'Gửi hình ảnh ngẫu nhiên về chó hoặc mèo',
        '/random `[one, two, three, ...]`': 'Trả về một kết quả ngẫu nhiên từ danh sách được nhập vào ngăn cách nhau bởi dấu phẩy',
        '/sbd `[sbd]`': 'Tra cứu điểm thi THPTQG 2025 thông qua số báo danh',
        '/translate `[to country]` `[text]`': 'Dịch một từ hoặc một đoạn văn ngắn sang một ngôn ngữ khác',
        '/upcoming_movies': 'Hiển thị các bộ phim sắp chiếu tại Cinestar',
    }

    const embed = new EmbedBuilder()
        .setTitle(`HELP COMMANDS`)
        .setColor('#00a2ff')
        .setTimestamp();

    embed.addFields(
        Object.entries(listCommand).map(([name, value]) => ({
            name,
            value,
            inline: false
        }))
    );

    await interaction.reply({
        embeds: [embed]
    });
}