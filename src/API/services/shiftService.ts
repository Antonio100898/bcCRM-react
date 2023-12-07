import {
  IDayInfo,
  IProblemsResponse,
  IShiftAndDaysInfoResponse,
  IShiftDetailsResponse,
  IShiftPlanReportResponse,
  IshiftDetail,
} from "../../Model";
import { ICustomResponse } from "../../Model/ICustomResponse";
import { instance } from "../axoisConfig";
import { workerKey } from "../../App"; 

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
    shiftGroupID: number
  ): Promise<IProblemsResponse | undefined> {
    try {
      const { data } = await instance.post("/UpdateShiftDayRemark", {
        workerKey,
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
        workerKey,
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
        workerKey,
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

  async getShiftPlansDetails(
    startTime: Date | string
  ): Promise<IShiftDetailsResponse | undefined> {
    try {
      const { data } = await instance.post("/GetShiftPlansDetails", {
        workerKey,
        startTime,
        addDays: 1,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async updateShiftDetails(
    shiftDetail: Partial<IshiftDetail>,
    shiftGroupID: number
  ): Promise<ICustomResponse | undefined> {
    try {
      const { data } = await instance.post("/UpdateShiftDetails", {
        workerKey,
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
        workerKey,
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
        workerKey,
        shiftId,
        newDate,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },
};
