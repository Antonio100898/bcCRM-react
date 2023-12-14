import { TOKEN_KEY } from "../../Consts/Consts";
import { IHardware, IProblemsResponse } from "../../Model";
import { instance } from "../axoisConfig";

export const hardwareService = {
  async getHardwareCounts(
    barcode: string
  ): Promise<IProblemsResponse | undefined> {
    try {
      const { data } = await instance.post("/GetHardwaresCount", {
        workerKey: localStorage.getItem(TOKEN_KEY),
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
        workerKey: localStorage.getItem(TOKEN_KEY),
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
        workerKey: localStorage.getItem(TOKEN_KEY),
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
        workerKey: localStorage.getItem(TOKEN_KEY),
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
