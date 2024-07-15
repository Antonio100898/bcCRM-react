import { IShiftPlan, IshiftDetail, IshiftWeek } from "../Model";

export type ConvertedShiftsTypes = {
  1: IshiftDetail[];
  2: IshiftDetail[];
  3: IshiftDetail[];
  4: IshiftDetail[];
};

export type ConvertedShifts = {
  sunday: ConvertedShiftsTypes;
  monday: ConvertedShiftsTypes;
  tuesday: ConvertedShiftsTypes;
  wendsday: ConvertedShiftsTypes;
  thursday: ConvertedShiftsTypes;
  friday: ConvertedShiftsTypes;
  saturday: ConvertedShiftsTypes;
};

export enum HEBREW_WEEK_DAY {
  "sunday" = "ראשון",
  "monday" = "שני",
  "tuesday" = "שלישי",
  "wendsday" = "רביעי",
  "thursday" = "חמישי",
  "friday" = "שישי",
  "saturday" = "שבת",
}

export const convertShifts = (data: IshiftWeek[]) => {
  let result: ConvertedShifts = {
    sunday: {
      "1": [] as IshiftDetail[],
      "2": [] as IshiftDetail[],
      "3": [] as IshiftDetail[],
      "4": [] as IshiftDetail[],
    },
    monday: {
      "1": [] as IshiftDetail[],
      "2": [] as IshiftDetail[],
      "3": [] as IshiftDetail[],
      "4": [] as IshiftDetail[],
    },

    tuesday: {
      "1": [] as IshiftDetail[],
      "2": [] as IshiftDetail[],
      "3": [] as IshiftDetail[],
      "4": [] as IshiftDetail[],
    },
    wendsday: {
      "1": [] as IshiftDetail[],
      "2": [] as IshiftDetail[],
      "3": [] as IshiftDetail[],
      "4": [] as IshiftDetail[],
    },
    thursday: {
      "1": [] as IshiftDetail[],
      "2": [] as IshiftDetail[],
      "3": [] as IshiftDetail[],
      "4": [] as IshiftDetail[],
    },
    friday: {
      "1": [] as IshiftDetail[],
      "2": [] as IshiftDetail[],
      "3": [] as IshiftDetail[],
      "4": [] as IshiftDetail[],
    },
    saturday: {
      "1": [] as IshiftDetail[],
      "2": [] as IshiftDetail[],
      "3": [] as IshiftDetail[],
      "4": [] as IshiftDetail[],
    },
  } as ConvertedShifts;

  [1, 2, 3, 4].forEach((shiftTypeId) => {
    Object.keys(result).forEach((key) => {
      result[key as keyof ConvertedShifts][
        shiftTypeId as keyof ConvertedShiftsTypes
      ] = data.find((item) => item.shiftType === shiftTypeId)![
        key as keyof ConvertedShifts
      ];
    });
  });
  return result;
};
