import { TOKEN_KEY } from "../../Consts/Consts";
import { Iv3Response } from "../../Model";
import { instance } from "../axoisConfig";

export const v3Service = {
  async getV3Groups(): Promise<Iv3Response | undefined> {
    try {
      const { data } = await instance.post("/GetV3Groups", {
        workerKey: localStorage.getItem(TOKEN_KEY),
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },
};
