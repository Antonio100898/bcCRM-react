import { IDepartment } from "./IDepartment";

export interface IWorker {
  Id: number;
  firstName: string;
  lastName: string;
  workerName: string;
  phone: string;
  userName: string;
  password: string;
  userTypeId: number;
  active: boolean;
  imgPath: string;
  imgContent: string;
  imgContentName: string;
  shluha: string;
  departmentId: number;
  departmentName: string;
  departments: IDepartment[];
  jobTitle: string;
  files: object;
  carType: string;
  carNumber: string;
  teudatZehut: string;
  marselWorkerCode: number;
}

export interface IWorkersResponse {
  d: {
    success: boolean;
    workers: IWorker[];
  };
}
export interface IWorkerResponse {
  d: {
    success: boolean;
    worker: IWorker;
  };
}
