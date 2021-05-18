import { makeAutoObservable, runInAction } from "mobx";
import { stringifyKey } from "mobx/dist/internal";
import agent from "../api/agent";
import { EditGeneral, BlockUser } from "../models/setting";
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
  usersBlocked = new Map<string, BlockUser>();
  activeItem = "account";
  isContentOpen = false;

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

  getUsersBlockedList = async () => {
    this.isLoading = true;
    try {
      const list = await agent.Settings.blockedUsersList();
      runInAction(() => {
        list.forEach((userBlocked) => {
          this.usersBlocked.set(userBlocked.id, userBlocked);
        });
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  openContent = () => (this.isContentOpen = true);
  closeContent = () => (this.isContentOpen = false);

  unblock = async (id: string) => {
    try {
      await agent.User.Unblock(id);
      this.usersBlocked.delete(id);
    } catch (error) {}
  };

  setEditting = (el: string) => {
    this.edittingEl = el;
  };

  setActiveItem = (activeItem: string) => {
    this.activeItem = activeItem;
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
