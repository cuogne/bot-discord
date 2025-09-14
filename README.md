# cừn-bot

Một con bot discord sieu cap ngu xi dan don duoc viet bang javascript.

Thêm bot vào server của bạn: [Invite bot](https://discord.com/oauth2/authorize?client_id=1395723998821879849)

## Commands

| Command | Parameter | Description | Usage |
|------|---------|-------|-----------|
| `/ai` | `<prompt>` | Chat với AI Groq | `/ai Xin chào bạn` |
| `/avatar` | `[user]` (không bắt buộc) | Lấy avatar của user | `/avatar @cừn` |
| ~~`/cgv`~~ | ~~`<province>` `<cinema>`~~ | ~~Xem lịch chiếu phim tại CGV~~ | ~~`/cgv TP.HCM CGV Vincom Đồng Khởi`~~|
| `/cinestar` | `<cinema>` | Xem lịch chiếu phim hôm nay tại Cinestar | `/cinestar Cinestar Sinh Viên - TP.HCM` |
| `/date` | *(không có)* | Hiển thị ngày giờ hiện tại (âm và dương lịch) | `/date` |
| `/dictionary` | `<word>` | Tra cứu từ vụng tiếng Anh trong từ điển | `/dictionary care` |
| `/fit-hcmus-news` | `setup\|latest\|status\|remove` | Nhận thông báo tin tức FIT-HCMUS | [Hướng dẫn chi tiết tại đây](commands/fit-hcmus-news/INSTRUCTION.md) |
| `/football club` | `<club>` | Xem lịch thi đấu cụ thể của các câu lạc bộ bóng đá | `/football club Manchester United` |
| `/football tournament` | `<tournament>` | Xem lịch thi đấu bóng đá của các giải đấu lớn (EPL, La Liga, ...) | `/football tournament Premier League` |
| `/football score` | *(không có)* | Xem tỷ số bóng đá của các trận đấu đêm qua và rạng sáng nay | `/football score` |
| `/gay` | `<user>` | _"Lòng tôi tan nát khi nhận ra tôi là ..."_ | `/gay @someone` |
| `/help` | *(không có)* | Hiển thị danh sách các lệnh có sẵn và còn hoạt động | `/help` |
| `/image` | `<dog \| cat>` | Gửi hình ảnh ngẫu nhiên về chó hoặc mèo | `/image dog` |
| `/random` | `<ele1, ele2, ele3, ...>` | Trả về các từ ngẫu nhiên do user nhập vào được phân cách bởi dấu phẩy | `/random táo,cam,chuối` |
| `/sbd` | `<text>` | Tra cứu điểm thi THPTQG 2025 | `/sbd 123456` |
| `/translate` | `<to> <text>` | Dịch văn bản sang tiếng được chọn | `/translate English Xin chào` |
| `/upcoming_movies` | *(không có)* | Xem danh sách phim sắp tới được chiếu tại Cinestar | `/upcoming_movies` |

> `/cgv` không còn hoạt động vì không chạy được trên cloud host

> ...