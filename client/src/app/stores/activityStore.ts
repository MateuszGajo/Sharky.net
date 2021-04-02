import { Activity, ActivityFormValues } from "./../models/activity";
import { makeAutoObservable } from "mobx";
import agent from "~api/agent";
import { RootStore } from "./rootStore";

export default class AcitivtyStore {
  root: RootStore;
  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  activities = new Map<string, Activity>();

  createActivity = async (activity: ActivityFormValues) => {
    try {
      await agent.Activities.create(activity).then((photo) => {});
    } catch (error) {}
  };

  setActivity = (activity: Activity) => {};

  getActivities = async () => {
    try {
      await agent.Activities.get().then((data) => {
        data.forEach((activity) => {
          this.activities.set(activity.id, activity);
        });
      });
    } catch (error) {}
  };

  likeHandle = async (isLiked: boolean, activityId: string) => {
    try {
      if (!isLiked) await agent.Activities.like(activityId);
      else await agent.Activities.unLike(activityId);
    } catch (error) {}
  };
}
