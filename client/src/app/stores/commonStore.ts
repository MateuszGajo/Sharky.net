import { makeAutoObservable } from "mobx";
import { User } from "../models/authentication";
import { RootStore } from "./rootStore";

export default class CommonStore {
  root: RootStore;
  user: User = { firstName: "", lastName: "", phone: "", id: "", email: "" };

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  hydrate(data?: any) {
    if (data) {
      this.user = data;
    }
  }

  getUser = () => {
    return this.user;
  };
}
