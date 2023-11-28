export interface IProblemLog {
  workerId: number;
  workerName: string;
  fieldName: string;
  oldValue: string;
  newValue: string;
  commitTime: string;
}
