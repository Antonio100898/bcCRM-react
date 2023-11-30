export interface IWorkExpensesType {
  id: string;
  workExpensName: string;
  workerId: string;
  workerName: string;
  categoryName: string;
  defValue: string;
  workExpensCategoryId: number;
  expenseTypeUnitValue: number;
  workExpensType: number;
  WorkerExpensesValueId: number;
  expenseValue: number;
  remark: string;
  freePass: boolean;
  startExpenseDate: Date;
  startExpenseDateEN: string;
  finishExpenseDate: Date;
  approved: boolean;
  orderIndex: string;
}

export interface IWorkExpensesTypeSum {
  workerId: string;
  workerName: string;
  totalSum: number;
  workExpense: number;
  bonus: number;
  fieldTrip: number;
  answerPrecentge: number;
  teudatZehut: string;
  marselWorkerCode: number;
}

export interface IWorkerExpensesTypeResponse {
  d: {
    success: boolean;
    msg: string;
    workExpensesTypes: IWorkExpensesType[];
    workerExpenses: IWorkExpensesType[];
    workerExpensesSum: IWorkExpensesTypeSum[];
  };
}
