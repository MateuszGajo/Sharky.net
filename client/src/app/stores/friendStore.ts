import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Friend, GetFriends, OnlineFriend } from "../models/user";
import { RootStore } from "./rootStore";

export default class FriendStore {
  root: RootStore;
  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  onlineFriends = new Map<string, OnlineFriend>();
  friends = new Map<string, Friend>();
  isMore = true;

  getOnlineFriends = async () => {
    try {
      const friends = await agent.Friends.getOnline();
      runInAction(() => {
        friends.forEach((friend) => {
          this.onlineFriends.set(friend.id, friend);
        });
      });
    } catch (error) {}
  };

  getFriends = async ({ id, filterText }: GetFriends) => {
    try {
      const friends = await agent.Friends.get({ id, from: this.friends.size });

      runInAction(() => {
        if (friends.length < 30) {
          this.isMore = false;
        }
        friends.forEach((friend) => {
          this.friends.set(friend.id, friend);
        });
      });
    } catch (error) {}
  };

  filterFriends = async (text: string) => {
    const filterText = text.trim().toLowerCase();
    this.friends.forEach((value, key) => {
      const { firstName, lastName } = value.user;
      const username = firstName.toLowerCase() + lastName.toLowerCase();
      if (!username.startsWith(filterText)) {
        this.friends.delete(key);
      }
    });
    if (this.friends.size < 20) {
      console.log("pobieramy");
    }
  };

  unfriend = async (friendshipId: string) => {
    try {
      await agent.Friends.unfriend(friendshipId);
      this.friends.delete(friendshipId);
    } catch (error) {}
  };
}
