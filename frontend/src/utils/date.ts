// frontend/src/utils/date.ts
export function formatEventDateRange(
  startIso: string,
  endIso: string,
): string {
  const start = new Date(startIso);
  const end = new Date(endIso);

  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };

  const startDateStr = start.toLocaleDateString(undefined, dateOptions);
  const startTimeStr = start.toLocaleTimeString(undefined, timeOptions);
  const endDateStr = end.toLocaleDateString(undefined, dateOptions);
  const endTimeStr = end.toLocaleTimeString(undefined, timeOptions);

  if (sameDay) {
    return `${startDateStr}, ${startTimeStr} – ${endTimeStr}`;
  }

  return `${startDateStr}, ${startTimeStr} → ${endDateStr}, ${endTimeStr}`;
}
