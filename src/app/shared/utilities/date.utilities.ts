export const formatDateToShortString = (date: Date): string => {
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};

export const formatDateToTime = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

export const isDateValid = (isoString: string): boolean => {
  const date = new Date(isoString);
  return !isNaN(date.getTime());
};


export function convertToUTCTimeString(localTime: string): string {
    const [hours, minutes] = localTime.split(':').map(Number);

    const localDate = new Date();
    localDate.setHours(hours, minutes, 0, 0);

    const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60 * 1000);

    const utcHours = String(utcDate.getUTCHours()).padStart(2, '0');
    const utcMinutes = String(utcDate.getUTCMinutes()).padStart(2, '0');
    const utcSeconds = String(utcDate.getUTCSeconds()).padStart(2, '0');

    return `${utcHours}:${utcMinutes}:${utcSeconds}`;
}

export function convertUTCToLocalTimeString(utcTime: string) {
    const [utcHours, utcMinutes, utcSeconds] = utcTime.split(':').map(Number);

    const utcDate = new Date();
    utcDate.setUTCHours(utcHours, utcMinutes, utcSeconds, 0);

    const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60 * 1000);

    const localHours = String(localDate.getHours()).padStart(2, '0');
    const localMinutes = String(localDate.getMinutes()).padStart(2, '0');
    return `${localHours}:${localMinutes}:00`;
}

export function formatDateWithoutTimezone(date: Date): string {
    return date.getFullYear() + '-' +
        ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
        ('0' + date.getDate()).slice(-2) + 'T' +
        ('0' + date.getHours()).slice(-2) + ':' +
        ('0' + date.getMinutes()).slice(-2) + ':' +
        ('0' + date.getSeconds()).slice(-2);
}
