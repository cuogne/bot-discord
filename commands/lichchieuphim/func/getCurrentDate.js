export function getCurrentDate() {
    const today = new Date(); // lay ngay hien tai
    const dateStr = today.toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh'
    }).split(" ")[1]; // lay ngay (dd/mm/yyyy)

    return dateStr;
}