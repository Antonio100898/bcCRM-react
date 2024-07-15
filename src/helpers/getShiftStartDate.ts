import { IDays } from "../Model";
import { addDays } from "./addDays";

export const getShiftStartDate = (
  startDate: Date,
  shiftTypeId: number,
  day: keyof IDays
) => {
  let time = 8;
  let daysToAdd = 0;

  switch (shiftTypeId) {
    case 1:
      time = 8;
      break;
    case 2:
      time = 12;
      break;
    case 3:
      time = 17;
      break;
    case 4:
      time = 23;
      break;
  }

  switch (day) {
    case "sunday":
      daysToAdd = 0;
      break;
    case "monday":
      daysToAdd = 1;
      break;
    case "tuesday":
      daysToAdd = 2;
      break;
    case "wendsday":
      daysToAdd = 3;
      break;
    case "thursday":
      daysToAdd = 4;
      break;
    case "friday":
      daysToAdd = 5;
      break;
    case "saturday":
      daysToAdd = 6;
      break;
  }

  const temp = new Date(addDays(startDate, daysToAdd));
  const dateOfShift = new Date(temp);
  dateOfShift.setHours(time);
  dateOfShift.setMinutes(0);
  dateOfShift.setSeconds(0);
  return dateOfShift.getTime().toString();
};
