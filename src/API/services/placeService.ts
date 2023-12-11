import { IPlace, IProblemsResponse } from "../../Model";
import { instance } from "../axoisConfig";
import { workerKey } from "../../App";

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
    place: Partial<IPlace>
  ): Promise<IProblemsResponse | undefined> {
    try {
      const { data } = await instance.post("/UpdatePhonePlace", {
        workerKey,
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
        workerKey,
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
        workerKey,
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
