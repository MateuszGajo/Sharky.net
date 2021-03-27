import { makeAutoObservable } from "mobx";
import agent from "~api/agent";
import { Activity } from "../models/activity";

export default class AcitivtyStore {
  constructor() {
    makeAutoObservable(this);
  }

  createActivity = async (activity: Activity) => {
    try {
      await agent.Activities.create(activity);
    } catch (error) {
      console.log(error);
    }
  };
}
