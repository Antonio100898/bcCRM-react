import { TOKEN_KEY } from "../../Consts/Consts";
import { IStatsResponse } from "../../Model";
import { instance } from "../axoisConfig";

export const statisticService = {
  async getStats(): Promise<IStatsResponse | undefined> {
    try {
      const { data } = await instance.post("/GetStats", {
        workerKey: localStorage.getItem(TOKEN_KEY),
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  },
};
