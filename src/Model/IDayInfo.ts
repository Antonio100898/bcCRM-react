import { IshiftWeek } from ".";

export interface IDayInfo {
  id: number;
  dayValue: string;
  dayValueEN: string;
  dayName: string;
  remark: string;
  holydayName: string;
  isToday: boolean;
}

export interface IShiftAndDaysInfoResponse {
  d: {
    msg: string;
    success: boolean;
    shiftsDays: IDayInfo[];
    shiftDetails: IshiftWeek[];
  };
}
