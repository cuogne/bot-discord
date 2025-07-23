# cừn-bot

Một con bot discord sieu cap ngu xi dan don duoc viet bang javascript.

Thêm bot vào server của bạn: [Invite bot](https://discord.com/oauth2/authorize?client_id=1395723998821879849)

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

## Commands

- `/date` - Hiển thị ngày giờ hiện tại
- `/avatar [user]` - Lấy avatar người dùng
- `/sbd <text>` - Tra cứu điểm thi THPTQG 2025
- `/cinestar` - Xem lịch chiếu phim hôm nay tại Cinestar 

> Thêm command mới? : rảnh thì làm...

## Cloud Host ?

- Hiện tại: https://ap-southeast-1.run.claw.cloud/ với 1 tháng được free 5$