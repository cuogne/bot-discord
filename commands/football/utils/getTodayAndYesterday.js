export function getTodayAndYesterday() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const formatDay = (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}${mm}${dd}`; // yyyymmdd (20250816)
    };

    return {
        yesterday: formatDay(yesterday),
        today: formatDay(today)
    };
}