import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { User } from "../models/activity";
import { Friend, GetFriends, OnlineFriend, UserList } from "../models/user";
import { RootStore } from "./rootStore";

export default class FriendStore {
  root: RootStore;
  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  onlineFriends = new Map<string, OnlineFriend>();
  friends = new Map<string, Friend>();
  userList = new Map<string, UserList>();
  isMoreFriends = true;
  isMoreUsers = true;
  lastFilter = "";

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
    if (this.lastFilter !== filterText && filterText !== undefined) {
      this.isMoreFriends = true;
      this.lastFilter = filterText;
      this.friends = new Map<string, Friend>();
    }
    this.fetchFriends(id, filterText);
  };

  fetchFriends = async (
    id: string | undefined,
    filterText: string | undefined
  ) => {
    try {
      const friends = await agent.Friends.get({
        id,
        from: this.friends.size,
        filterText: filterText,
      });

      runInAction(() => {
        if (friends.length < 30) {
          this.isMoreFriends = false;
        }
        friends.forEach((friend) => {
          this.friends.set(friend.id, friend);
        });
      });
    } catch (error) {}
  };

  getUser = async (filterText: string) => {
    if (this.lastFilter !== filterText && filterText !== undefined) {
      this.isMoreFriends = true;
      this.lastFilter = filterText;
      this.userList = new Map<string, UserList>();
    }
    this.fetchUser(filterText);
  };

  addFriend = async (userId: string) => {
    console.log(userId);
    try {
      this.root.commonStore.hubConnection?.invoke("AddFriend", userId);
      this.userList.delete(userId);
    } catch (error) {}
  };

  fetchUser = async (filterText: string | undefined) => {
    try {
      const users = await agent.User.get(this.userList.size, filterText);
      runInAction(() => {
        users.forEach((user) => {
          if (users.length < 30) {
            this.isMoreUsers = false;
          }
          this.userList.set(user.id, user);
        });
      });
    } catch (error) {}
  };

  unfriend = async (friendshipId: string) => {
    try {
      await agent.Friends.unfriend(friendshipId);
      this.friends.delete(friendshipId);
    } catch (error) {}
  };

  acceptRequest = async (friendshipId: string, notifyId: string) => {
    try {
      await agent.Friends.acceptRequest(friendshipId, notifyId);
    } catch {}
  };

  declineRequest = async (friendshipId: string, notifyId: string) => {
    try {
      await agent.Friends.declineRequest(friendshipId, notifyId);
    } catch {}
  };
}
