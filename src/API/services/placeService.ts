import { IPlace, IProblemsResponse } from "../../Model";
import { instance } from "../axoisConfig";
import { workerKey } from "../axoisConfig";

export const placeService = {
  async updatePlaceInfo(
    placeInfo: Partial<IPlace>
  ): Promise<IProblemsResponse | undefined> {
    try {
      const { data } = await instance.post("/UpdatePhonePlace", {
        workerKey,
        ...placeInfo,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },
};
