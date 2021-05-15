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

  editGeneral = async ({ firstname, lastname }: EditGeneral) => {
    try {
      await agent.Settings.editGeneral({ firstname, lastname });
      if (firstname) this.firstname = firstname;
      if (lastname) this.lastname = lastname;
    } catch (error) {}
  };
}
