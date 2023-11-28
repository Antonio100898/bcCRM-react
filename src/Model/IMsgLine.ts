export interface IMsgLine {
  workerId: number;
  workerName: string;
  msg: string;
  msgType: number;
  commitTime: string;
  commitTimeEN: string;
  workerImgPath: string;
}

export interface IChatLinesResponse {
  d: {
    success: boolean;
    msgLines: IMsgLine[];
  };
}
