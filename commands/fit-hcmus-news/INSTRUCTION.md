## Mục đích
- Dành cho những sinh viên đang theo học tại khoa CNTT - HCMUS có thể cập nhật tin tức nhanh chóng từ web của Khoa (có nhiều tin quan trọng mà thường tụi nó lười lên web để check lắm - kể cả t). 

> - Hiện tại chỉ hỗ trợ nhận thông báo qua server trong Discord

## Resource:

- FIT@HCMUS: https://www.fit.hcmus.edu.vn/vn/Default.aspx?tabid=53
- Lịch thi - Phòng khảo thí: http://ktdbcl.hcmus.edu.vn/
- Thông báo - Phòng khảo thí: http://ktdbcl.hcmus.edu.vn/
- Thông tin dành cho sinh viên - HCMUS: https://hcmus.edu.vn/category/dao-tao/dai-hoc/thong-tin-danh-cho-sinh-vien/page/1


## Command
- `/fit-hcmus-news latest`: trả về tin gần nhất của FIT-HCMUS.
- `/fit-hcmus-news setup`: thiết lập kênh sẽ nhận thông báo
- `/fit-hcmus-news status`: hiển thị trạng thái và thông tin của kênh nhận thông báo.
- `/fit-hcmus-news remove`: hủy thiết lập của kênh nhận thông báo.

## Hướng dẫn

1. Thêm bot vào server hoặc là chọn thêm app. Sử dụng lệnh `/fit-hcmus-news setup` để setup kênh nhận thông báo.

2. Sau khi đã chọn kênh, mỗi khi web FIT-HCMUS có tin mới thì sẽ được báo qua kênh vừa setup ở trên (quét mỗi 10 phút)
    > Bạn có thể kiểm tra kênh nào đã được setup để thông báo bằng lệnh `/fit-hcmus-news status`.

3. Nếu bạn không muốn nhận thông báo nữa, hãy dùng lệnh `/fit-hcmus-news remove`.

## Lưu ý
> Các lệnh setup và remove ở trên đều yêu cầu quyền quản trị viên trong server Discord để thiết lập nhận thông báo. Và chỉ có thể thiết lập một kênh nhận thông báo trong một server. 

> (Bạn có thể tạo một server riêng của bạn với con bot này để nhận tin cho dễ ;-;)