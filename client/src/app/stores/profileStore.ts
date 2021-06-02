import { makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { UserDetails } from "../models/user";
import { RootStore } from "./RootStore";

export default class ProfileStore {
  root: RootStore;

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  activeItem = "posts";
  isLoading = true;
  userDetails: UserDetails | null = null;

  getUserDetails = async (id: string) => {
    try {
      const resp = await this.root.userStore.userDetails(id);
      this.userDetails = resp;
      this.isLoading = false;
    } catch (error) {}
  };

  changePhoto = async (photo: Blob) => {
    try {
      const { photo: newPhoto } = await agent.User.changePhoto(photo);
      const newUserDetails = {
        ...this.userDetails!,
        photo: { ...newPhoto },
      };
      this.userDetails = newUserDetails;
    } catch (error) {}
  };

  setActiveItem = (item: string) => {
    this.activeItem = item;
  };
}
