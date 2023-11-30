import { IDayInfo, IshiftDetail } from "../../Model";
import { ICustomResponse } from "../../Model/ICustomResponse";
import { instance } from "../axoisConfig";
import { workerKey } from "../axoisConfig";

export const shiftService = {
  async updateShiftPlan(shiftDetails: Partial<IshiftDetail>): Promise<ICustomResponse | undefined> {
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

  async cancelShiftPlan(shiftPlanId: number): Promise<ICustomResponse | undefined> {
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
};
