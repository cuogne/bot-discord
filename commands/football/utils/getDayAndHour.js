export function getDayAndHour(date) {
    const newDate = new Date(date);
    const dayObj = newDate.toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }).split('/');
    const day = `${dayObj[0].padStart(2, '0')}/${dayObj[1].padStart(2, '0')}/${dayObj[2]}`;

    const hour = newDate.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Ho_Chi_Minh'
    }); // hh:mm

    return { day, hour };
}