import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { User } from "../models/authentication";
import { RootStore } from "./rootStore";

export default class CommonStore {
  root: RootStore;
  user: User = {
    firstName: "",
    lastName: "",
    phone: "",
    id: "",
    email: "",
    photo: null,
  };

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  hubConnection: HubConnection | null = null;
  notificationCount = 0;
  messagesCount = 0;
  friendRequestCount = 0;

  getNotification = async () => {
    try {
      const { notificationCount, messagesCount, friendRequestCount } =
        await agent.User.getNotification();
      runInAction(() => {
        this.notificationCount = notificationCount;
        this.messagesCount = messagesCount;
        this.friendRequestCount = friendRequestCount;
      });
    } catch (error) {}
  };

  readNotification = async () => {
    try {
      await agent.User.readNotification();
      runInAction(() => {
        this.notificationCount = 0;
      });
    } catch (error) {}
  };

  createHubConnection = (path: string) => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5000/commonHub")
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .catch((err) => console.log("Error establishing the connection: ", err));

    this.root.messageStore.messageListener();
    this.root.activityStore.likeListener(path);
    this.root.activityStore.activityListener(path);
    this.root.notificationStore.friendRequestNotifyListener(path);
  };

  stopHubConnection = () => {
    this.hubConnection
      ?.stop()
      .catch((err) => console.log("Error stopping connection: ", err));
  };

  hydrate(data?: any) {
    if (data) {
      this.user = data;
    }
  }

  getUser = () => {
    return this.user;
  };
}
