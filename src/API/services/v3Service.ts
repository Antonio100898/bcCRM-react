import { Iv3Response } from "../../Model";
import { instance } from "../axoisConfig";
import { workerKey } from "../../App"; 

export const v3Service = {
  async getV3Groups(): Promise<Iv3Response | undefined> {
    try {
      const { data } = await instance.post("/GetV3Groups", {
        workerKey,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },
};
