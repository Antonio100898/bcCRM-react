export function getDateTimeFormatEN(d: string, h: string) {
  return `${new Date(d).getMonth() + 1}/${new Date(d).getDate()}/${new Date(
    d
  ).getFullYear()} ${h}`;
  // new Date(d).getHours() +
  // ":" +
  // new Date(d).getMinutes()
}
