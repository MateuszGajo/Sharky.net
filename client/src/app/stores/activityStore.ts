import { Activity, ActivityFormValues } from "./../models/activity";
import { makeAutoObservable } from "mobx";
import agent from "~api/agent";

export default class AcitivtyStore {
  constructor() {
    makeAutoObservable(this);
  }

  activities: Activity[] = [];

  createActivity = async (activity: ActivityFormValues) => {
    try {
      await agent.Activities.create(activity);
    } catch (error) {}
  };

  getActivities = async () => {
    try {
      await agent.Activities.get().then((data) => {
        this.activities = data;
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
