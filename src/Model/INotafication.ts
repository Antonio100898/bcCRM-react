export interface INotification {
  id: number;
  problemId: number;
  workerId: number;
  msg: string;
  hadSeen: boolean;
  commitTime: string;
  commitTimeEN: string;
}

export interface INotifictionsResponse {
  d: {
    notifications: INotification[];
  };
}

export interface INotificationsCountResponse {
  d: {
    notificationsCount: number;
  };
}
