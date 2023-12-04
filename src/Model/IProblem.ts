import { IHardware } from "./IHardware";
import { IMsgLine } from "./IMsgLine";
import { IPhonePlace } from "./IPhonePlace";
import { IProblemType } from "./IProblemType";

export type CrmFile = {
  filename: string;
  content: string;
};

export interface IProblem {
  workerKey: string;
  id: number;
  startTime: string;
  startTimeEN: string;
  workerCreateId: number;
  workerCreateName: string;
  customerName: string;
  phoneId: number;
  phone: string;
  placeId: number;
  placeName: string;
  ip: string;
  desc: string;
  solution: string;
  statusId: number;
  statusName: string;
  emergencyId: number;
  vip: boolean;
  departmentName: string;
  departmentId: number;
  toWorker: number;
  toWorkerName: string;
  problemTypesList: IProblemType[];
  toWorkerJobTitle: string;
  filesName: string;
  files: string[];
  newFiles: string[];
  crmFiles: CrmFile[];
  historySummery: string;
  lastSuppoter: string;
  msgLinesCount: number;
  takingCare: boolean;
  isLocked: boolean;
  callCustomerBack: boolean;
  trackingId: number;

  toWorkers?: number[];
  problemTypes?: string[];
  fileCount: number;
  updaterWorkerId: number;
  updaterWorkerName: string;
  updaterWorkerDepartmentId: number;
  finishTime: string;
  finishTimeEN: string;
}

export interface IProblemContainerBasic {
  problem?: IProblem;
}

export interface IProblemContainer extends IProblemContainerBasic {
  click: (pro: IProblem) => void;
  ticketColor: string;
  textColor: string;
}

export interface IProblemsResponse {
  d: {
    problems: IProblem[];
    places: IPhonePlace[];
    hardwares: IHardware[];
    hardwaresCount: IHardware[];

    success: boolean;
    problemId?: number;
    msg: string;
    lastSuppoter: string;
    trackingId: number;
    msgLinesCount: number;

    phone: string;
    workerId: number;
    filesName: string[];
    msgLines: IMsgLine[];
  };
}
