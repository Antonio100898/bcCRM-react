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
