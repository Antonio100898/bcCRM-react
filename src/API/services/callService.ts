import { ICustomResponse } from "../../Model/ICustomResponse";
import { workerKey } from "../axoisConfig";
import { instance } from "../axoisConfig";

export const callService = {
  async callClientPhone(phone: string): Promise<ICustomResponse> {
    try {
      const { data } = await instance.post("/CallThisNumber", {
        workerKey,
        phone,
      });
      return data;
    } catch (error) {
      console.error;
    }
  },
};
