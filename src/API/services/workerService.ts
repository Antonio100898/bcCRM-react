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
import { workerKey } from "../../main";

export const workerService = {
  async getWorkExpensesTypes(): Promise<
    IWorkerExpensesTypeResponse | undefined
  > {
    try {
      const { data } = await instance.post("/GetWorkExpensesTypes", {
        workerKey,
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
        workerKey,
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
        workerKey,
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
        workerKey,
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
        workerKey,
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
        workerKey,
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
        workerKey,
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
        workerKey,
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
        workerKey,
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
        workerKey,
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
        workerKey,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async getWorker(): Promise<IWorkerResponse | undefined> {
    try {
      const { data } = await instance.post("/GetWorker", {
        workerKey,
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
        workerKey,
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
        workerKey,
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
        workerKey,
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
        workerKey,
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
        workerKey,
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
        workerKey,
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
        workerKey,
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
        workerKey,
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
