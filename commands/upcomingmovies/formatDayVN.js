export function formatDayVN(date) {
    const [month, day, year] = date.split('/')
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
}