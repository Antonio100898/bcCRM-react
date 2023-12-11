import { HeaderSummery, IProblemType, IWorker } from ".";

export interface ILoginResponse {
  d: {
    success: boolean;
    msg: string;
    key: string;
    userName: string;
    password: string;
    workerId: number;
    workerName: string;
    jobTitle: string;
    userType: number;
    active: boolean;
    department: number;
    imgPath: string;
    shluha: number;
    teudatZehut: number;
    workers: IWorker[];
    problemTypes: IProblemType[];
    summery: HeaderSummery;
    workerType: number;
  };
}
