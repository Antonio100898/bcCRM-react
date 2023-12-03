import {
  IDayInfo,
  IShiftAndDaysInfoResponse,
  IShiftDetailsResponse,
  IShiftPlanReportResponse,
  IshiftDetail,
} from "../../Model";
import { ICustomResponse } from "../../Model/ICustomResponse";
import { instance } from "../axoisConfig";
import { workerKey } from "../axoisConfig";

export const shiftService = {
  async updateShiftPlan(
    shiftDetails: Partial<IshiftDetail>
  ): Promise<ICustomResponse | undefined> {
    try {
      const { data } = await instance.post("/UpdateShiftPlan", {
        workerKey,
        shiftDetails,
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
        workerKey,
        shiftPlanId,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async updateShiftDayRemark(
    day: IDayInfo,
    shiftGroupId: number
  ): Promise<ICustomResponse | undefined> {
    try {
      const { data } = await instance.post("/UpdateShiftDayRemark", {
        workerKey,
        day,
        shiftGroupId,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async appendDefultWeekShifts(
    startTime: string,
    shiftGroupId: number
  ): Promise<ICustomResponse | undefined> {
    try {
      const { data } = await instance.post("/AppendDefultWeekShifts", {
        workerKey,
        startTime,
        shiftGroupId,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async getShiftDetails(
    startTime: Date,
    shiftGroupId: number
  ): Promise<IShiftAndDaysInfoResponse | undefined> {
    try {
      const { data } = await instance.post("/GetShiftDetails", {
        workerKey,
        startTime,
        shiftGroupId,
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
        workerKey,
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
        workerKey,
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
        workerKey,
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
          workerKey,
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
        workerKey,
        startTime,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },
};
