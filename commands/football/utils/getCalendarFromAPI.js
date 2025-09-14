export async function getCalendarFromAPI(link) {
    try {
        const response = await fetch(link);
        const dataCalendar = await response.json(); // get data

        if (
            !dataCalendar.leagues ||
            !Array.isArray(dataCalendar.leagues) ||
            !dataCalendar.leagues[0] ||
            !Array.isArray(dataCalendar.leagues[0].calendar)
        ) {
            await interaction.editReply('Không tìm thấy calendar');
            return;
        }

        const calendar = dataCalendar.leagues[0].calendar;

        // chuan hoa thoi gian trong api yyyy-mm-dd => yyyymmdd
        return calendar.map(day => day.split('T')[0].replaceAll('-', ''));
    }
    catch (error) {
        return null;
    }
}