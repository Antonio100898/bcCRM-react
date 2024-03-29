import { TOKEN_KEY } from "../../Consts/Consts";
import { IProblem, IProblemsResponse } from "../../Model";
import { ICustomResponse } from "../../Model/ICustomResponse";
import { instance } from "../axoisConfig";
import { AxiosRequestConfig } from "axios";

export const fileService = {
  async deleteFile(
    fileName: string,
    problemId: number
  ): Promise<ICustomResponse | undefined> {
    try {
      const { data } = await instance.post("/DeleteFile", {
        fileName,
        problemId,
        workerKey: localStorage.getItem(TOKEN_KEY),
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async uploadFiles(
    problem: IProblem,
    config: AxiosRequestConfig<{ problem: IProblem }>
  ): Promise<IProblemsResponse | undefined> {
    try {
      const { data } = await instance.post(
        "/UploadProblemFiles",
        { problem },
        config
      );
      return data;
    } catch (error) {
      console.error(error);
    }
  },
};
