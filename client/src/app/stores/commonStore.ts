import { makeAutoObservable } from "mobx";
import { User } from "../models/authentication";
import cookies from "js-cookie";
import { verifyJWT, verifyJWTSyn } from "../utils/utils";
import { RootStore } from "./RootStore";

export default class CommonStore {
  root: RootStore;
  user: User = { firstName: "", lastName: "", phone: "", id: "", email: "" };

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  hydrate(data?: any) {
    if (data) {
      console.log(data);
      this.user = data;
    }
  }

  getUser = () => {
    return this.user;
  };
}
