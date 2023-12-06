import { IStatsResponse } from "../../Model";
import { instance } from "../axoisConfig";
import { workerKey } from "../../main";

export const statisticService = {
  async getStats(): Promise<IStatsResponse | undefined> {
    try {
      const { data } = await instance.post("/GetStats", {
        workerKey,
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  },
};
