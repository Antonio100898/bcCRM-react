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
} from "../../Model";
import { ICustomResponse } from "../../Model/ICustomResponse";
import { instance } from "../axoisConfig";
import { workerKey } from "../axoisConfig";

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
};
