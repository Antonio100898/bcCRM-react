import {
  INotificationsCountResponse,
  INotifictionsResponse,
} from "../../Model";
import { ICustomResponse } from "../../Model/ICustomResponse";
import { instance } from "../axoisConfig";
import { workerKey } from "../../App"; 

export const notificationService = {
  async deleteNotification(
    notificationId: number
  ): Promise<ICustomResponse | undefined> {
    try {
      const { data } = await instance.post("/DeleteNotification", {
        notificationId,
        workerKey,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async updateNotificationHadSeen(
    notificationId: number,
    hadSeen: boolean
  ): Promise<ICustomResponse | undefined> {
    try {
      const { data } = await instance.post("/UpdateNotificationHadSeen", {
        notificationId,
        hadSeen,
        workerKey,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async getNotificationsCount(): Promise<
    INotificationsCountResponse | undefined
  > {
    try {
      const { data } = await instance.post("/GetNotificationsCount", {
        workerKey,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async getNotifications(): Promise<INotifictionsResponse | undefined> {
    try {
      const { data } = await instance.post("/GetNotifications", {
        workerKey,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  async deleteNotificationAll(): Promise<INotifictionsResponse | undefined> {
    try {
      const { data } = await instance.post("/DeleteNotificationAll", {
        workerKey,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },
};
