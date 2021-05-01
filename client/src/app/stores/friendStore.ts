import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { User } from "../models/activity";
import { Friend } from "../models/user";
import { RootStore } from "./rootStore";

export default class FriendStore {
  root: RootStore;
  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  friends = new Map<string, Friend>();
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

    this.hubConnection.on(
      "ReciveMessage",
      (
        id: string,
        message: string,
        conversationId: string,
        createdAt: Date,
        user: User,
        friendId: string
      ) => {
        if (
          this.root.messageStore.isMessengerOpen &&
          this.root.messageStore.conversationId == conversationId
        ) {
          const newMessage = {
            id,
            createdAt,
            body: message,
            author: user,
          };
          this.root.messageStore.messages.set(newMessage.id, newMessage);
        } else {
          const friend = this.friends.get(friendId);
          if (friend) {
            const newFriendObject: Friend = {
              ...friend,
              conversation: {
                ...friend.conversation!,
                messageTo: this.root.commonStore.user.id,
              },
            };
            this.friends.set(newFriendObject.id, newFriendObject);
          }
        }
      }
    );
  };

  stopHubConnection = () => {
    this.root.friendStore.hubConnection
      ?.stop()
      .catch((err) => console.log("Error stopping connection: ", err));
  };

  getFriends = async () => {
    try {
      const friends = await agent.Friends.get();
      friends.forEach((friend) => {
        this.friends.set(friend.id, friend);
      });
    } catch (error) {}
  };
}
