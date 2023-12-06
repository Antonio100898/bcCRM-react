export interface IProblemLog {
  workerId: number;
  workerName: string;
  fieldName: string;
  oldValue: string;
  newValue: string;
  commitTime: string;
}

export interface IProblemLogResponse {
  d: {
    msg: string;
    success: boolean;
    logs: IProblemLog[];
  };
}
