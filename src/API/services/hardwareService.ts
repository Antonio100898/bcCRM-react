import { IHardware, IProblemsResponse } from "../../Model";
import { instance } from "../axoisConfig";
import { workerKey } from "../../main";

export const hardwareService = {
  async getHardwareCounts(
    barcode: string
  ): Promise<IProblemsResponse | undefined> {
    try {
      const { data } = await instance.post("/GetHardwaresCount", {
        workerKey,
        barcode,
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  async getHardWare(barcode: string): Promise<IProblemsResponse | undefined> {
    try {
      const { data } = await instance.post("/GetHardware", {
        workerKey,
        barcode,
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  async updateHardware(
    hardware: Partial<IHardware>
  ): Promise<IProblemsResponse | undefined> {
    try {
      const { data } = await instance.post("/UpdateHardware", {
        workerKey,
        hardware,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async updateHardwareTracking(
    hardware: Partial<IHardware>
  ): Promise<IProblemsResponse | undefined> {
    try {
      const { data } = await instance.post("/UpdateHardwareTracking", {
        workerKey,
        hardwareId: hardware.id,
        statusId: hardware.statusId,
        cusName: hardware.cusName,
        remark: hardware.remark,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },
};
