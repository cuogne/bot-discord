# cừn-bot

Một con bot discord sieu cap ngu xi dan don duoc viet bang javascript.

Thêm bot vào server của bạn: [Invite bot](https://discord.com/oauth2/authorize?client_id=1395723998821879849)

## Commands

| Command | Parameter | Description | Usage |
|------|---------|-------|-----------|
| `/date` | *(không có)* | Hiển thị ngày giờ hiện tại (âm và dương lịch) | `/date` |
| `/avatar` | `[user]` (không bắt buộc) | Lấy avatar của user | `/avatar @cừn` |
| `/sbd` | `<text>` | Tra cứu điểm thi THPTQG 2025 | `/sbd 123456` |
| `/cinestar` | `<cinema>` | Xem lịch chiếu phim hôm nay tại Cinestar | `/cinestar Cinestar Sinh Viên - TP.HCM` |
| `/upcoming_movies` | *(không có)* | Xem danh sách phim sắp tới được chiếu tại Cinestar | `/upcoming_movies` |
| `/translate` | `<to> <text>` | Dịch văn bản sang tiếng được chọn | `/translate English Xin chào` |
| `/gay` | `<user>` | _"Lòng tôi tan nát khi nhận ra tôi là ..."_ | `/gay @someone` |
| `/random` | `<ele1, ele2, ele3, ...>` | Trả về các từ ngẫu nhiên do user nhập vào được phân cách bởi dấu phẩy | `/random táo,cam,chuối` |
| `/football_tournament` | `<tournament>` | Xem lịch thi đấu bóng đá của các giải đấu lớn (EPL, La Liga, ...) | `/football_tournament Premier League` |
| `/football_club` | `<club>` | Xem lịch thi đấu cụ thể của các câu lạc bộ bóng đá | `/football_club Manchester United` |
| `/dictionary` | `<word>` | Tra cứu từ vụng tiếng Anh trong từ điển | `/dictionary care` |
| `/help` | *(không có)* | Hiển thị danh sách các lệnh có sẵn và còn hoạt động | `/help` |
| ~~`/cgv`~~ | ~~`<province>` `<cinema>`~~ | ~~Xem lịch chiếu phim tại CGV~~ | ~~`/cgv TP.HCM CGV Vincom Đồng Khởi`~~|

> `/cgv` không còn hoạt động vì không chạy được trên cloud host

> ...

## Cài đặt

### Setup Discord Bot
1. Tạo ứng dụng trên [Discord Developer Portal](https://discord.com/developers/applications)
2. Tạo bot mới (New Application) và copy lấy token của bot
3. Click vào "Bot" và bật "MESSAGE CONTENT INTENT" để bot có thể đọc nội dung tin nhắn
4. Click vào "OAuth2" và chọn các quyền cần thiết:
    - `Send Messages`
    - `Read Message History`
5. Tạo URL mời bot vào server của bạn với các quyền đã chọn

### Setup Code
1. Cài đặt [Node.js](https://nodejs.org/) và [npm](https://www.npmjs.com/get-npm) (nếu chưa có)
   
- Kiểm tra cài đặt:
```bash
node -v
npm -v
```

2. Clone repository về máy
```bash
git clone https://github.com/cuogne/bot-discord.git
```

3. Di chuyển vào thư mục gốc và cài đặt dependencies:
```bash
cd bot-discord
npm install
```

4. Tạo file `.env` với nội dung:
```bash
BOT_TOKEN=your_discord_bot_token_here # Thay bằng token bot của bạn (đã copy ở trên)
```

5. Chạy bot:
```bash
npm start
```

Sau đó mở Discord, vào server đã mời bot và thử các lệnh.

## Cloud Host ?

- Hiện tại: https://ap-southeast-1.run.claw.cloud/ với 1 tháng được free 5$ credit cho CPU và RAM host bot.