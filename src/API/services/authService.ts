import { LoginCredetials } from "../../Context/UserContext";
import { ILoginResponse } from "../../Model";
import { instance } from "../axoisConfig";

export const authService = {
  async login(
    credentials: LoginCredetials
  ): Promise<ILoginResponse | undefined> {
    try {
      const { data } = await instance.post("/login", { ...credentials });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async loginAgain(
    credentials: LoginCredetials
  ): Promise<ILoginResponse | undefined> {
    try {
      const { data } = await instance.post("/loginAgain", { ...credentials });
      return data;
    } catch (error) {
      console.error(error);
    }
  },
};
