import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { makeAutoObservable } from "mobx";
import { User as ActivityUser } from "../models/activity";
import { User } from "../models/authentication";
import { Friend } from "../models/user";
import { RootStore } from "./RootStore";

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

  createHubConnection = () => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5000/conversationHub")
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .catch((err) => console.log("Error establishing the connection: ", err));

    this.hubConnection.on("aa", (aa) => {
      console.log("aaaaaaaa");
    });

    this.root.messageStore.messageListener();

    this.hubConnection.on("activityAdded", (args, bb) => {
      console.log(args);
      console.log(bb);
    });
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
