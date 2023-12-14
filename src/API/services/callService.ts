import { TOKEN_KEY } from "../../Consts/Consts";
import { ICustomResponse } from "../../Model/ICustomResponse";
import { instance } from "../axoisConfig";


export const callService = {
  async callClientPhone(phone: string): Promise<ICustomResponse | undefined> {
    try {
      const { data } = await instance.post("/CallThisNumber", {
        workerKey: localStorage.getItem(TOKEN_KEY),
        phone,
      });
      return data;
    } catch (error) {
      console.error;
    }
  },
};
