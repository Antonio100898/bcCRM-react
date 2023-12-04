import { IProblemType } from "./IProblemType";
import { IWorker } from "./IWorker";

export interface IUser {
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
}



// export type UserType = "Admin" | "Client" | "GroupAdmin";
