import {
  IChatLinesResponse,
  IProblem,
  IProblemLogResponse,
  IProblemSummeryResponse,
  IProblemsResponse,
  ISearchProblem,
} from "../../Model";
import { ICustomResponse } from "../../Model/ICustomResponse";
import { instance } from "../axoisConfig";
import { workerKey } from "../../App";

export const problemService = {
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

  async addProblemMessage(
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

  async getProblemMessages(
    problemId: number
  ): Promise<IChatLinesResponse | undefined> {
    try {
      const { data } = await instance.post("/GetChatLines", {
        workerKey,
        problemId,
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

  async searchProblems(
    filter: Partial<ISearchProblem>
  ): Promise<IProblemsResponse | undefined> {
    try {
      const { data } = await instance.post("/SearchProblems", {
        search: { ...filter, key: workerKey },
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async updateProblem(
    problem: Partial<IProblem>
  ): Promise<IProblemsResponse | undefined> {
    try {
      const { data } = await instance.post("/UpdateProblem", {
        problem: { ...problem, crmFiles: [], files: [] },
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async updateProblemTracking(
    problemId: number,
    trackingId: number
  ): Promise<ICustomResponse | undefined> {
    try {
      const { data } = await instance.post("/UpdateProblemTracking", {
        problemId,
        trackingId,
        workerKey,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async answeredCall(
    department: string | number
  ): Promise<IProblemsResponse | undefined> {
    try {
      const { data } = await instance.post("/AnsweredCall", {
        department,
        workerKey,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async getProblemLogs(
    problemId: number
  ): Promise<IProblemLogResponse | undefined> {
    try {
      const { data } = await instance.post("/GetProblemLogs", {
        problemId,
        workerKey,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async updateMsgLine(msgId: number, updatedMsg: string) {
    try {
      const { data } = await instance.post("/UpdateMsgLine", {
        workerKey,
        msgId,
        updatedMsg,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async deleteMsgLine(msgId: number) {
    try {
      const { data } = await instance.post("/DeleteMsgLine", {
        workerKey,
        msgId,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },
};
