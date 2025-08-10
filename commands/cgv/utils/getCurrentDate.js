export function getCurrentDate() {
    const today = new Date(); // lay ngay hien tai
    const VNTime = new Date(today.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
    const day = String(VNTime.getDate()).padStart(2, '0');
    const month = String(VNTime.getMonth() + 1).padStart(2, '0');
    const year = VNTime.getFullYear();

    return `${day}-${month}-${year}`;
}