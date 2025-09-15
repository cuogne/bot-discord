export function getTodayAndTwoWeeksLater() {
    const today = new Date();

    const idxToday = 0;
    const idxDayOfTwoWeek = 13;

    const formatDay = (idx) => {
        const date = new Date(today);
        date.setDate(today.getDate() + idx);

        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}${mm}${dd}`;
    }

    const listDay = [formatDay(idxToday), formatDay(idxDayOfTwoWeek)];
    // console.log(listDay);

    return listDay;
}