export const baseUrl = 'http://127.0.0.1:5359/api/raqoshop/';

export function formatDeDate(dateSended: Date | string): string {
    let dateObject = new Date(dateSended);
    let formattedDate = dateObject.toISOString().split('T')[0]
    let HourSplited = dateObject.toISOString().split('T')[1]
    let formattedHour = HourSplited.split(':')[0]+':'+HourSplited.split(':')[1]
    return `${formattedDate} à ${formattedHour}`
}

export function getFilePathFromDBPath(dbPath: string): string {
    const pathWithoutSrc = dbPath.replace(/\\/g, "/");
    const api_link = localStorage.getItem('api_Link');
    // return `https://apicommerce.ababi.ci/${pathWithoutSrc}`;
    
    return `${baseUrl}/${pathWithoutSrc}`;
}