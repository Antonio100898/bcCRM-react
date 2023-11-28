export interface HeaderSummery {
  departments: [ProblemSummery];
  // openProblems: number;
  // HandlingProblems: number;
  // Iopened: number;
  // tech: number;
  // dejavoo: number;
  // upgrades: number;
  // reportToYaron: number;
  // resets: number;
  // menu: number;
  // software: number;
  // counting: number;
  // marketing: number;
  // users: number;
  // returnToClient: number;
  // developers: number;
  // allProblems: number;
  // todayProblems: number;
  // delivery_server: number;
}

export interface ProblemSummery {
  departmentId: number;
  departmentName: string;
  departmentValue: string;
  count: number;
}

export interface IProblemSummeryResponse {
  d: {
    summery: HeaderSummery

    success: boolean;
    problemId?: number;
    msg: string;
    lastSuppoter: string;
    trackingId: number;
    msgLinesCount: number;
  };
}
