import { DateTime } from "luxon";
import { SUPPORTED_DATE_FORMATS_FOR_PARSING } from "../constants/supported-date-formats.constants";

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

export const formatDateToShortTime = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const isDateValid = (isoString: string): boolean => {
  const date = new Date(isoString);
  return !isNaN(date.getTime());
};

export const isISODateFormat = (str: string): boolean => {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?([+-]\d{2}:\d{2})?/;
  return isoDateRegex.test(str);
};

/**
 * Converts YYYY-MM-DD or DD-MM-YYYY date string with/without leading zeros into iso string
 */
export const convertStringDateToIso = (dateString: string): string | null => {
  const date = convertStringDateToDate(dateString);
  if (!date) return null;
  return date.toISO();
};

export const convertStringDateToDate = (dateString: string | null): DateTime | null => {
  if (!dateString) return null;
  for (const format of SUPPORTED_DATE_FORMATS_FOR_PARSING) {
    const dateTime = DateTime.fromFormat(dateString, format);
    if (dateTime.isValid) {
      return dateTime;
    }
  }
  return null;
};

export const convertIsoDateToDateString = (isoDate: string | null, format: string): string | null => {
  if (!isoDate) return null;
  const dateTime = DateTime.fromISO(isoDate);
  if (!dateTime.isValid) return null;
  return dateTime.toFormat(format);
};

export const convertDateStringIntoAnotherDateString = (dateString: string, formatDate: string): string | null => {
  for (const format of SUPPORTED_DATE_FORMATS_FOR_PARSING) {
    const dateTime = DateTime.fromFormat(dateString, format);
    if (dateTime.isValid) {
      return dateTime.toFormat(formatDate);
    }
  }

  return null;
};

export const formatDateToTodayDateString = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

export const formatDateToGetWithDay = (dateString: string): string => {
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return formatter.format(date);
};

export const getDateAfterWeekDaysOccurrences = (date: DateTime, occurrences: number): DateTime => {
  let currentDate = date;
  let currentOccurrence = 0;
  while (currentOccurrence < occurrences) {
    // Increment only if the day is between Monday & Friday
    if (currentDate.weekday >= 1 && currentDate.weekday <= 5) {
      currentOccurrence++;
      if (currentDate.weekday === 5) {
        currentDate = currentDate.plus({ days: 3 });
      } else {
        currentDate = currentDate.plus({ days: 1 });
      }
    } else if (currentDate.weekday === 6) {
      // Start date is a Saturday
      currentDate = currentDate.plus({ days: 2 });
    } else {
      currentDate = currentDate.plus({ days: 1 });
    }
  }
  return currentDate;
};

/**
 *
 * @param startDateTime string (ex: "2024-08-13T21:10:00")
 * @param endDateTime string (ex: "2024-08-13T21:10:00")
 * @returns string (ex: "11:50")
 */
export const getFormattedTimeDifference = (startDateTime: string, endDateTime: string): string => {
  const start = DateTime.fromISO(startDateTime);
  const end = DateTime.fromISO(endDateTime);
  const diff = end.diff(start, ["hours", "minutes"]);
  return diff.toFormat("hh:mm");
};
