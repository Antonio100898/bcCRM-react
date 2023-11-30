export interface IWorkerSickday {
  id: number;
  workerId: number;
  workerName: string;
  startDate: Date;
  startDateEN: string;
  finishDate: Date;
  finishDateEN: string;

  daysLen: number;

  fileName: string;
  imgContent: string;

  cancel: boolean;
}
export interface IWorkerSickdayResponse {
  d: {
    success: boolean;
    workerSickDay: IWorkerSickday[];
  };
}
export interface IWorkerFreeday {
  id: number;
  workerId: number;
  workerName: string;
  startDate: Date;
  startDateEN: string;
  finishDate: Date;
  finishDateEN: string;

  remark: string;
  daysLen: number;
  cancel: boolean;
  statusId: number;
}
export interface IWorkerFreedayResponse {
  d: {
    success: boolean;
    workerFreeDay: IWorkerFreeday[];
  };
}
