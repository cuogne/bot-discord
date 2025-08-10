export function formatDay(date) {
    const [year, month, day] = date.split('-')
    return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`
}