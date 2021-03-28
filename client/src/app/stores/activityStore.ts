import { Activity } from "./../models/activity";
import { makeAutoObservable } from "mobx";
import agent from "~api/agent";

export default class AcitivtyStore {
  constructor() {
    makeAutoObservable(this);
  }

  activities = [];

  createActivity = async (activity: Activity) => {
    try {
      await agent.Activities.create(activity);
    } catch (error) {
      console.log(error);
    }
  };

  getActivities = async () => {
    try {
      await agent.Activities.get().then(({ data }) => {
        this.activities = data;
      });
    } catch (error) {
      console.log(error);
    }
  };
}
