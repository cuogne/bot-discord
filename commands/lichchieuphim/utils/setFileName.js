export function setFileName(dateString) {
    const [day, month, year] = dateString.split('/');
    if (!day || !month || !year) {
        return dateString.replace(/\//g, '-');
    }
    return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
} 