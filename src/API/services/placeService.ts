import { TOKEN_KEY } from "../../Consts/Consts";
import { IPhonePlace, IProblemsResponse } from "../../Model";
import { instance } from "../axoisConfig";

export const placeService = {
  async getPlacesForPhone(
    phone: string
  ): Promise<IProblemsResponse | undefined> {
    try {
      const { data } = await instance.post("/GetPlacesForPhone", {
        phone,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async updatePhonePlace(
    place: Partial<IPhonePlace>
  ): Promise<IProblemsResponse | undefined> {
    try {
      const { data } = await instance.post("/UpdatePhonePlace", {
        workerKey: localStorage.getItem(TOKEN_KEY),
        ...place,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async getPlacesBizNumber(): Promise<IProblemsResponse | undefined> {
    try {
      const { data } = await instance.post("/GetPlacesBizNumber", {
        workerKey: localStorage.getItem(TOKEN_KEY),
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async updatePlaceBizNumber(
    id: number | undefined,
    placeName: string | undefined,
    bizNumber: string | undefined,
    warrantyType: number | undefined
  ): Promise<IProblemsResponse | undefined> {
    try {
      const { data } = await instance.post("/UpdatePlaceBizNumber", {
        workerKey: localStorage.getItem(TOKEN_KEY),
        id,
        placeName,
        bizNumber,
        warrantyType,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },
};
