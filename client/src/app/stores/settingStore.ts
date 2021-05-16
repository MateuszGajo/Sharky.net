import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { EditGeneral } from "../models/setting";
import { RootStore } from "./rootStore";

export default class SettingStore {
  root: RootStore;
  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }
  isLoading = false;
  firstname = "";
  lastname = "";
  edittingEl = "";

  getGeneral = async () => {
    this.isLoading = true;
    try {
      const { firstname, lastname } = await agent.Settings.getGeneral();
      runInAction(() => {
        this.firstname = firstname;
        this.lastname = lastname;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  setEditting = (el: string) => {
    this.edittingEl = el;
  };

  editSecurity = async (
    type: string,
    currentValue: string,
    newValue: string
  ) => {
    const apiCalls = {
      email: (email: string, newEmail: string) =>
        agent.Settings.editEmail(email, newEmail),
      password: (password: string, newPassword: string) =>
        agent.Settings.editPassword(password, newPassword),
    };

    try {
      await apiCalls[type as keyof typeof apiCalls](currentValue, newValue);
    } catch (error) {
      console.log(error.response);
    }
  };

  editGeneral = async ({ firstname, lastname }: EditGeneral) => {
    try {
      await agent.Settings.editGeneral({ firstname, lastname });
      if (firstname) this.firstname = firstname;
      if (lastname) this.lastname = lastname;
    } catch (error) {}
  };
}
