export interface IExpenseAndShiftWeek {
  days: IExpenseAndShiftDay[];
}

export interface IExpenseAndShiftDay {
  dDay: string;
  dDayEN: string;
  dayInMonth: number;
  totalSum: number;
  totalMinutes: number;
  workers: IExpenseAndShift[];
}

export interface IExpenseAndShift {
  workerId: number;
  workerName: string;
  dDay: string;
  dDayEN: string;

  sumExpense: number;
  sumHours: string;
  totalMinutes: number;
  category1Sum: number;
  category2Sum: number;
  expensNames: string;
  remark: string;
  shifts: IEzShift[];
}

export interface IEzShift {
  startTime: string;
  startTimeEN: string;
  finishTime: string;
  finishTimeEN: string;
  totalMinutes: number;
}
