import { RootStore } from "./RootStore";
import { Notification as NotificationI } from "~models/notification";
import agent from "../api/agent";
import { makeAutoObservable } from "mobx";

export default class NotificationStore {
  root: RootStore;
  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }
  notifications = new Map<string, NotificationI>();

  getNotification = async () => {
    try {
      const notifications = await agent.Notification.get();
      notifications.forEach((item) => {
        this.notifications.set(item.id, item);
      });
    } catch (error) {}
  };
}
