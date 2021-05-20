import { makeAutoObservable, runInAction } from "mobx";
import { RootStore } from "./RootStore";
import agent from "~api/agent";

export default class UserStore {
  root: RootStore;
  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  blockUser = async (id: string) => {
    try {
      await agent.User.block(id);
      const activities = Array.from(
        this.root.activityStore.activities.values()
      ).filter((item) => item.user.id == id);

      runInAction(() => {
        for (let i = 0; i < activities.length; i++) {
          this.root.activityStore.activities.delete(activities[i].id);
        }
      });
    } catch (error) {}
  };
}
