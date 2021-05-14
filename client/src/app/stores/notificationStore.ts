import { RootStore } from "./rootStore";
import { Notification as NotificationI } from "~models/notification";
import agent from "../api/agent";
import { makeAutoObservable, runInAction } from "mobx";
import { User } from "../models/activity";

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
      runInAction(() => {
        notifications.forEach((item) => {
          this.notifications.set(item.id, item);
        });
      });
    } catch (error) {}
  };

  friendRequestNotifyListener = (path: string) => {
    this.root.commonStore.hubConnection?.on(
      "friendRequestNotify",
      (
        friendshipId: string,
        requestedAt: Date,
        notifyId: string,
        user: User
      ) => {
        if (path === "/notifications") {
          const newNotify = {
            id: notifyId,
            user,
            type: "friend",
            action: "add",
            createdAt: requestedAt,
            refId: friendshipId,
          };
          this.notifications.set(newNotify.id, newNotify);
        } else {
          this.root.commonStore.notificationCount += 1;
        }
      }
    );
  };

  acceptFriendRequest = async (friendshipId: string, notifyId: string) => {
    this.root.friendStore
      .acceptRequest(friendshipId, notifyId)
      .then(() => this.notifications.delete(notifyId));
  };

  declineFriendRequest = async (friendshipId: string, notifyId: string) => {
    this.root.friendStore
      .declineRequest(friendshipId, notifyId)
      .then(() => this.notifications.delete(notifyId));
  };
}
