export function getWeekDate(arg: "start" | "finish") {
  const date = new Date();
  const today = date.getDate();
  const currentDay = date.getDay();
  let newDate;

  switch (arg) {
    case "start":
      newDate = date.setDate(today - currentDay);
      break;
    case "finish":
      newDate = date.setDate(today + (6 - currentDay));
  }

  return new Date(newDate);
}