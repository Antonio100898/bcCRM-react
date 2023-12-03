export interface IStats {
  workerId: number;
  workerName: string;
  totalProblems: number;
  closeProblems: number;
  openProblems: number;
  firstHourOpenProblem: number;
  lastHourOpenProblem: number;
  firstHourCloseProblem: number;
  lastHourCloseProblem: number;
  movedProblems: number;
  openAndOnHim: number;
}

export interface IStatsResponse {
  d: {
    msg: string;
    success: boolean;
    stats: IStats[];
  };
}
