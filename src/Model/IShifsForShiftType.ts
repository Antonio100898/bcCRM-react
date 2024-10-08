export interface IshiftDetail {
  id: number;
  shiftTypeId: number;
  shiftName: string;
  jobTypeId: number;
  jobTypeName: string;
  workerId: number;
  workerName: string;
  startDate: string;
  startDateEN: string;
  finishTime: string;
  finishTimeEN: string;
  startHour: string;
  finishHour: string;
  dayName: string;
  remark: string;
  placeName: string;
  address: string;
  contactName: string;
  phone: string;
  color: string;
}

export interface IShiftPlan {
  id: number;
  shiftTypeId: number;
  workerId: number;
  startDate: string;
  startDateEN: string;
  remark: string;
  cancel: boolean;
}

export interface IshiftWeek {
  jobType: number;
  jobTypeName: string;
  shiftType: number;
  shiftTypeName: string;
  color: string;

  sunday: IshiftDetail[];
  monday: IshiftDetail[];
  tuesday: IshiftDetail[];
  wendsday: IshiftDetail[];
  thursday: IshiftDetail[];
  friday: IshiftDetail[];
  saturday: IshiftDetail[];
}

export interface IDays {
  sunday: IshiftDetail[];
  monday: IshiftDetail[];
  tuesday: IshiftDetail[];
  wendsday: IshiftDetail[];
  thursday: IshiftDetail[];
  friday: IshiftDetail[];
  saturday: IshiftDetail[];
}

export interface IshiftWeekReportExcel {
  workerName: string;

  sunday: number;
  monday: number;
  tuesday: number;
  wendsday: number;
  thursday: number;
  friday: number;
  saturday: number;
}

export interface IShiftPlanReportResponse {
  d: {
    msg: string;
    success: boolean;
    shiftPlanReport: IshiftWeekReportExcel[];
  };
}

export interface IShiftDetailsResponse {
  d: {
    msg: string;
    success: boolean;
    workerShifts: IshiftDetail[];
    shiftPlanDetails: IshiftDetail[];
  };
}

export interface ShiftDetailForServer {
  id: number;
  shiftTypeId: number;
  workerId: number;
  startDate: Date | string;
  startDateEN: string;
  remark: string;
  cancel: boolean;
  shiftName: string;
  jobTypeId: number;
  jobTypeName: string;
  color: string | null;
  workerName: string;
  finishTime: Date | string;
  finishTimeEN: string;
  placeName: string;
  address: string;
  dayName: string | null;
  contactName: string;
  phone: string;
  startHour: string;
  finishHour: string;
  shiftGroupId: number;
  isShiftManager: boolean;
}
