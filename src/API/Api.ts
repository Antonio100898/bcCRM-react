import axios from "axios";
import { TOKEN_KEY } from "../Consts/Consts";
import { AxiosRequestConfig } from "axios";
import {
  IshiftDetail,
  IProblemsResponse,
  IProblemSummeryResponse,
  IChatLinesResponse,
  IHardware,
  IDepartmentResponse,
  IProblem,
  ISearchProblem,
  IDayInfo,
  INotificationsCountResponse,
  INotifictionsResponse,
  IWorkExpensesType,
  IWorkerSickday,
  IWorker,
  IDepartment,
} from "../Model";

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

  async deleteFile(fileName: string, problemId: number): Promise<any> {
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

  async updateProblem(
    problem: IProblem
  ): Promise<IProblemsResponse | undefined> {
    try {
      const { data } = await instance.post("/UpdateProblem", { problem });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async uploadProblemFiles(
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

  async deleteNotification(notificationId: number): Promise<any> {
    try {
      const { data } = await instance.post("/DeleteNotification", {
        notificationId,
        workerKey,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async updateNotificationHadSeen(
    notificationId: number,
    hadSeen: boolean
  ): Promise<any> {
    try {
      const { data } = await instance.post("/UpdateNotificationHadSeen", {
        notificationId,
        hadSeen,
        workerKey,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async getNotificationsCount(): Promise<
    INotificationsCountResponse | undefined
  > {
    try {
      const { data } = await instance.post("/GetNotificationsCount", {
        workerKey,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async getNotifications(): Promise<INotifictionsResponse | undefined> {
    try {
      const { data } = await instance.post("/GetNotifications", {
        workerKey,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async deleteNotificationAll(): Promise<INotifictionsResponse | undefined> {
    try {
      const { data } = await instance.post("/DeleteNotificationAll", {
        workerKey,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async searchProblems(
    filter: Partial<ISearchProblem>
  ): Promise<IProblemsResponse | undefined> {
    try {
      const { data } = await instance.post("/SearchProblems", {
        ...filter,
        key: workerKey,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async updateShiftPlan(shiftDetails: Partial<IshiftDetail>): Promise<any> {
    try {
      const { data } = await instance.post("/UpdateShiftPlan", {
        workerKey,
        shiftDetails,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async cancelShiftPlan(shiftPlanId: number): Promise<any> {
    try {
      const { data } = await instance.post("/CancelShiftPlan", {
        workerKey,
        shiftPlanId,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async updateShiftDayRemark(
    day: IDayInfo,
    shiftGroupId: number
  ): Promise<any> {
    try {
      const { data } = await instance.post("/UpdateShiftDayRemark", {
        workerKey,
        day,
        shiftGroupId,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async getWorkExpensesTypes(): Promise<any> {
    try {
      const { data } = await instance.post("/GetWorkExpensesTypes", {
        workerKey,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async updateWorkExpensesTypes(
    expensesType: IWorkExpensesType[]
  ): Promise<any> {
    try {
      const data = await instance.post("/UpdateWorkExpensesTypes", {
        workerKey,
        expensesType,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async getWorkersSickdays(
    year: string,
    month: string,
    justMe: boolean
  ): Promise<any> {
    try {
      const data = await instance.post("/GetWorkersSickdays", {
        workerKey,
        year,
        month,
        justMe,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async updateWorkerSickday(sickDay: IWorkerSickday): Promise<any> {
    try {
      const data = await instance.post("/UpdateWorkerSickday", {
        workerKey,
        sickDay,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async getWorkers(): Promise<any> {
    try {
      const data = await instance.post("/GetWorkers", {
        workerKey,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async updateWorker(
    worker: Partial<IWorker>,
    departments: IDepartment[],
    workerExpensesValue: IWorkExpensesType[]
  ): Promise<any> {
    try {
      const data = await instance.post("/UpdateWorker", {
        workerKey,
        worker,
        departments,
        workerExpensesValue,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },
};
