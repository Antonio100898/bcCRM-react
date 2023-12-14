import { TOKEN_KEY } from "../../Consts/Consts";
import {
  IDepartmentResponse,
  IWorkExpensesType,
  IWorkerExpensesTypeResponse,
  IWorker,
  IWorkerFreeday,
  IWorkerFreedayResponse,
  IWorkerResponse,
  IWorkerSickday,
  IWorkerSickdayResponse,
  IWorkersResponse,
  IExpenseAndShiftWeekResponse,
} from "../../Model";
import { ICustomResponse } from "../../Model/ICustomResponse";
import { instance } from "../axoisConfig";

export const workerService = {
  async getWorkExpensesTypes(): Promise<
    IWorkerExpensesTypeResponse | undefined
  > {
    try {
      const { data } = await instance.post("/GetWorkExpensesTypes", {
        workerKey: localStorage.getItem(TOKEN_KEY),
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async updateWorkExpensesTypes(
    expensesType: IWorkExpensesType[]
  ): Promise<ICustomResponse | undefined> {
    try {
      const { data } = await instance.post("/UpdateWorkExpensesTypes", {
        workerKey: localStorage.getItem(TOKEN_KEY),
        expensesType,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async getWorkersSickdays(
    year: string,
    month: string,
    justMe: boolean
  ): Promise<IWorkerSickdayResponse | undefined> {
    try {
      const { data } = await instance.post("/GetWorkersSickdays", {
        workerKey: localStorage.getItem(TOKEN_KEY),
        year,
        month,
        justMe,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async updateWorkerSickday(
    sickDay: IWorkerSickday
  ): Promise<ICustomResponse | undefined> {
    try {
      const { data } = await instance.post("/UpdateWorkerSickday", {
        workerKey: localStorage.getItem(TOKEN_KEY),
        sickDay,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async getWorkers(): Promise<IWorkersResponse | undefined> {
    try {
      const { data } = await instance.post("/GetWorkers", {
        workerKey: localStorage.getItem(TOKEN_KEY),
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async getWorkerDepartments(
    workerId: number
  ): Promise<IDepartmentResponse | undefined> {
    try {
      const { data } = await instance.post("/GetWorkerDepartments", {
        workerId,
        workerKey: localStorage.getItem(TOKEN_KEY),
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async getWorkerExpensesValue(
    workerId: number
  ): Promise<IWorkerExpensesTypeResponse | undefined> {
    try {
      const { data } = await instance.post("/GetWorkerExpensesValue", {
        workerId,
        workerKey: localStorage.getItem(TOKEN_KEY),
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async appendWorkerExpensesValue(
    workerId: number,
    workExpensesType: string,
    sum: string
  ): Promise<ICustomResponse | undefined> {
    try {
      const { data } = await instance.post("/AppendWorkerExpensesValue", {
        workerId,
        workerKey: localStorage.getItem(TOKEN_KEY),
        workExpensesType,
        sum,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async getWorkersFreedays(
    year: string,
    month: string,
    justMe: boolean
  ): Promise<IWorkerFreedayResponse | undefined> {
    try {
      const { data } = await instance.post("/GetWorkersFreedays", {
        workerKey: localStorage.getItem(TOKEN_KEY),
        year,
        month,
        justMe,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async updateWorkerFreeday(
    freeDay: IWorkerFreeday
  ): Promise<ICustomResponse | undefined> {
    try {
      const { data } = await instance.post("/UpdateWorkerFreeday", {
        workerKey: localStorage.getItem(TOKEN_KEY),
        freeDay,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async getWorkersCars(): Promise<IWorkersResponse | undefined> {
    try {
      const { data } = await instance.post("/GetWorkersCars", {
        workerKey: localStorage.getItem(TOKEN_KEY),
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async getWorker(): Promise<IWorkerResponse | undefined> {
    try {
      const { data } = await instance.post("/GetWorker", {
        workerKey: localStorage.getItem(TOKEN_KEY),
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async updateWorker(
    worker: Partial<IWorker>
  ): Promise<ICustomResponse | undefined> {
    try {
      const { data } = await instance.post("/UpdateWorker", {
        workerKey: localStorage.getItem(TOKEN_KEY),
        worker,
        departments: null,
        workerExpensesValue: null,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async getWorkersExpenses(
    year: string,
    months: string,
    filterWorkerId: string
  ): Promise<IWorkerExpensesTypeResponse | undefined> {
    try {
      const { data } = await instance.post("/GetWorkersExpenses", {
        workerKey: localStorage.getItem(TOKEN_KEY),
        year,
        months,
        filterWorkerId,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async updateWorkesExpensesApprove(
    workerExpenses: IWorkExpensesType[]
  ): Promise<ICustomResponse | undefined> {
    try {
      const { data } = await instance.post("/UpdateWorkesExpensesApprove", {
        workerKey: localStorage.getItem(TOKEN_KEY),
        workerExpenses,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async cancelWorkerExpenses(
    expenseId: string
  ): Promise<ICustomResponse | undefined> {
    try {
      const { data } = await instance.post("/CancelWorkerExpenses", {
        workerKey: localStorage.getItem(TOKEN_KEY),
        expenseId,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async getExpensesAndShiftForMonth(
    year: string,
    month: string,
    departmentId: string,
    workerId: number
  ): Promise<IExpenseAndShiftWeekResponse | undefined> {
    try {
      const { data } = await instance.post("/GetExpensesAndShiftForMonth", {
        workerKey: localStorage.getItem(TOKEN_KEY),
        year,
        month,
        departmentId,
        workerId,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async updateWorkerExpence(
    expense: IWorkExpensesType
  ): Promise<ICustomResponse | undefined> {
    try {
      const { data } = await instance.post("/UpdateWorkerExpence", {
        workerKey: localStorage.getItem(TOKEN_KEY),
        expense,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async getWorkExpensesTypesForWorker(): Promise<
    IWorkerExpensesTypeResponse | undefined
  > {
    try {
      const { data } = await instance.post("/GetWorkExpensesTypesForWorker", {
        workerKey: localStorage.getItem(TOKEN_KEY),
        filterWorkerId: 0,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async appendWorkerExpence(
    startExpenceDate: Date | string | undefined,
    finishExpenceDate: Date | string | undefined,
    expenseType: string,
    sum: number | string,
    expenseTypeUnitValue: string,
    freePass: boolean,
    remark: string
  ): Promise<IWorkerExpensesTypeResponse | undefined> {
    try {
      const { data } = await instance.post("/AppendWorkerExpence", {
        workerKey: localStorage.getItem(TOKEN_KEY),
        startExpenceDate,
        finishExpenceDate,
        expenseType,
        sum,
        expenseTypeUnitValue,
        freePass,
        remark,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },
};
