import { TOKEN_KEY } from "../../Consts/Consts";
import {
  IDayInfo,
  IProblemsResponse,
  IShiftAndDaysInfoResponse,
  IShiftDetailsResponse,
  IShiftPlan,
  IShiftPlanReportResponse,
  ShiftDetailForServer,
} from "../../Model";
import { ICustomResponse } from "../../Model/ICustomResponse";
import { instance } from "../axoisConfig";

export const shiftService = {
  async updateShiftPlan(
    shiftPlans: IShiftPlan[]
  ): Promise<ICustomResponse | undefined> {
    try {
      const { data } = await instance.post("/UpdateShiftPlan", {
        workerKey: localStorage.getItem(TOKEN_KEY),
        shiftPlans,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async cancelShiftPlan(
    shiftPlanId: number
  ): Promise<ICustomResponse | undefined> {
    try {
      const { data } = await instance.post("/CancelShiftPlan", {
        workerKey: localStorage.getItem(TOKEN_KEY),
        shiftPlanId,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async updateShiftDayRemark(
    day: IDayInfo,
    shiftGroupID: number
  ): Promise<IProblemsResponse | undefined> {
    try {
      const { data } = await instance.post("/UpdateShiftDayRemark", {
        workerKey: localStorage.getItem(TOKEN_KEY),
        day,
        shiftGroupID,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async appendDefultWeekShifts(
    startTime: string,
    shiftGroupID: number
  ): Promise<ICustomResponse | undefined> {
    try {
      const { data } = await instance.post("/AppendDefultWeekShifts", {
        workerKey: localStorage.getItem(TOKEN_KEY),
        startTime,
        shiftGroupID,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async getShiftDetails(
    startTime: Date,
    shiftGroupID: number
  ): Promise<IShiftAndDaysInfoResponse | undefined> {
    try {
      const { data } = await instance.post("/GetShiftDetails", {
        workerKey: localStorage.getItem(TOKEN_KEY),
        startTime,
        shiftGroupID,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async getWorkersMissingShiftsPlan(
    start: string
  ): Promise<ICustomResponse | undefined> {
    try {
      const { data } = await instance.post("/GetWorkersMissingShiftsPlan", {
        workerKey: localStorage.getItem(TOKEN_KEY),
        start,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async getShiftPlans(
    startTime: Date
  ): Promise<IShiftAndDaysInfoResponse | undefined> {
    try {
      const { data } = await instance.post("/GetShiftPlans", {
        workerKey: localStorage.getItem(TOKEN_KEY),
        startTime,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async getShiftPlansForWorker(
    startTime: Date
  ): Promise<IShiftAndDaysInfoResponse | undefined> {
    try {
      const { data } = await instance.post("/GetShiftPlansForWorker", {
        workerKey: localStorage.getItem(TOKEN_KEY),
        startTime,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async getShiftPlansWeekReport(
    startTime: string
  ): Promise<IShiftPlanReportResponse | undefined> {
    try {
      const { data } = await instance.post(
        "/GetShiftPlansGetShiftPlansWeekReportForWorker",
        {
          workerKey: localStorage.getItem(TOKEN_KEY),
          startTime,
          addDays: 7,
        }
      );
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async getShiftsForWorker(
    startTime: Date
  ): Promise<IShiftDetailsResponse | undefined> {
    try {
      const { data } = await instance.post("/GetShiftsForWorker", {
        //workerKey: localStorage.getItem(TOKEN_KEY),
        startTime,
        workerId: 197,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async getShiftPlansDetails(
    startTime: Date | string,
    shiftTypeId: number
  ): Promise<IShiftDetailsResponse | undefined> {
    try {
      const { data } = await instance.post("/GetShiftPlansDetails", {
        workerKey: localStorage.getItem(TOKEN_KEY),
        startTime,
        addDays: 1,
        shiftTypeId,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async updateShiftDetails(
    shiftDetail: ShiftDetailForServer,
    shiftGroupID: number
  ): Promise<ICustomResponse | undefined> {
    try {
      const { data } = await instance.post("/UpdateShiftDetails", {
        workerKey: localStorage.getItem(TOKEN_KEY),
        shiftDetail,
        shiftGroupID,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async cancelShift(shiftId: number): Promise<ICustomResponse | undefined> {
    try {
      const { data } = await instance.post("/CancelShift", {
        workerKey: localStorage.getItem(TOKEN_KEY),
        shiftId,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async updateShiftStartDate(
    shiftId: number,
    newDate: Date | string
  ): Promise<ICustomResponse | undefined> {
    try {
      const { data } = await instance.post("/UpdateShiftStartDate", {
        workerKey: localStorage.getItem(TOKEN_KEY),
        shiftId,
        newDate,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },
};
