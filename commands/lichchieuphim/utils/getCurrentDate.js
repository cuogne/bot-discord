export function getCurrentDate() {
    const today = new Date(); // lay ngay hien tai
    const dateStr = today.toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh'
    }).split(" ")[1]; // lay ngay (dd/mm/yyyy)

    const [day, month, year] = dateStr.split('/');
    const formattedDate = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;

    return formattedDate;
}