export function getDayOfTwoWeek() {
    const today = new Date();
    const daysOfTwoWeek = [];

    for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');

        daysOfTwoWeek.push(`${yyyy}${mm}${dd}`); // yyyymmdd (20250816)
    }

    return daysOfTwoWeek;
}