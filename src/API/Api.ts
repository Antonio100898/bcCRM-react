import axios from "axios";
import { TOKEN_KEY } from "../Consts/Consts";
import { IProblemsResponse } from "../Model/IProblem";
import { IProblemSummeryResponse } from "../Model/HeaderSummery";
import { IChatLinesResponse } from "../Model/IMsgLine";
import { IHardware } from "../Model/IHardware";
import { IDepartmentResponse } from "../Model/IWorker";

const instance = axios.create({
  baseURL: "http://localhost:56967/CrmWS.asmx/",
  // baseURL: 'https://beecomm-blueslot.azurewebsites.net/crmws.asmx/',
  // baseURL: 'https://beecomm.azurewebsites.net/crmws.asmx/',
  headers: {
    "Content-Type": "application/json",
  },
});

const workerKey = localStorage.getItem(TOKEN_KEY);

export const api = {
  async getProblems(
    department: string
  ): Promise<IProblemsResponse | undefined> {
    try {
      const { data } = await instance.post("/GetProblems", {
        filter: department || "-1",
        workerKey,
      });

      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async getProblemSummary(): Promise<IProblemSummeryResponse | undefined> {
    try {
      const { data } = await instance.post("/GetProblemSummery", {
        workerKey,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async addChatLines(
    problemId: number,
    newLine: string
  ): Promise<IChatLinesResponse | undefined> {
    try {
      const { data } = await instance.post("/AddNewChatLine", {
        workerKey,
        problemId,
        newLine,
        lineType: 1,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async getHardwareCounts(
    barcode: string
  ): Promise<IProblemsResponse | undefined> {
    try {
      const { data } = await instance.post("/GetHardwaresCount", {
        workerKey,
        barcode,
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  async getHardWare(barcode: string): Promise<IProblemsResponse | undefined> {
    try {
      const { data } = await instance.post("/GetHardware", {
        workerKey,
        barcode,
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  async updateHardware(
    hardware: Partial<IHardware>
  ): Promise<IProblemsResponse | undefined> {
    try {
      const { data } = await instance.post("/UpdateHardware", {
        workerKey,
        hardware,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async updateHardwareTracking(
    hardware: Partial<IHardware>
  ): Promise<IProblemsResponse | undefined> {
    try {
      const { data } = await instance.post("/UpdateHardwareTracking", {
        workerKey,
        hardwareId: hardware.id,
        statusId: hardware.statusId,
        cusName: hardware.cusName,
        remark: hardware.remark,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async deleteFile(fileName: string, problemId: number) {
    try {
      const { data } = await instance.post("/DeleteFile", {
        fileName,
        problemId,
        workerKey,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async getProblemHistorySummery(
    placeId: number,
    problemId: number
  ): Promise<IProblemsResponse | undefined> {
    try {
      const { data } = await instance.post("/GetProblemHistorySummery", {
        placeId,
        problemId,
        workerKey,
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  async getWorkerDepartments(
    workerId: number
  ): Promise<IDepartmentResponse | undefined> {
    try {
      const { data } = await instance.post("/GetWorkerDepartments", {
        workerId,
        workerKey,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },
};
