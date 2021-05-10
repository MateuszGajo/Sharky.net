import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Friend } from "../models/user";
import { RootStore } from "./rootStore";

export default class FriendStore {
  root: RootStore;
  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  onlineFriends = new Map<string, Friend>();

  getFriends = async () => {
    try {
      const friends = await agent.Friends.get({ online: true });
      runInAction(() => {
        friends.forEach((friend) => {
          this.onlineFriends.set(friend.id, friend);
        });
      });
    } catch (error) {}
  };
}
