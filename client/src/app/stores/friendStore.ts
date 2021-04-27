import { makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { Friend } from "../models/user";
import { RootStore } from "./rootStore";

export default class FriendStore {
  root: RootStore;
  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  friends = new Map<string, Friend>();

  getFriends = async () => {
    try {
      const friends = await agent.Friends.get();
      friends.forEach((friend) => {
        this.friends.set(friend.id, friend);
      });
    } catch (error) {}
  };
}
