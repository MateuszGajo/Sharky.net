import {
  ActivityFormValues,
  CreateActResp,
  ActivityMap,
  Reply,
  CommentMap,
  Activity,
} from "./../models/activity";
import { makeAutoObservable, runInAction } from "mobx";
import agent from "~api/agent";
import { RootStore } from "./rootStore";

export default class AcitivtyStore {
  root: RootStore;
  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  activities = new Map<string, ActivityMap>();
  activity: ActivityMap | undefined = undefined;

  isSubmitting = false;

  get activitiesByDate() {
    return Array.from(this.activities.values()).sort((a, b) => {
      return (
        new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime()
      );
    });
  }

  createActivity = async (activity: ActivityFormValues) => {
    this.isSubmitting = true;
    try {
      const resp = await agent.Activities.create(activity);
      this.setActivity(activity, resp);
      runInAction(() => {
        this.isSubmitting = false;
      });
    } catch (error) {
      runInAction(() => {
        this.isSubmitting = false;
      });
    }
  };

  editActivity = async (
    editedActivity: ActivityFormValues,
    activityId: string,
    appActivityId: string
  ) => {
    this.isSubmitting = true;
    try {
      const resp = await agent.Activities.edit(editedActivity, activityId);
      const activity = this.activities.get(appActivityId);
      if (activity) {
        const newActivity = {
          ...activity,
          photo: resp.photo ? resp.photo : activity?.photo,
          content: editedActivity.content,
        };
        this.activities.set(appActivityId, newActivity);
      }
    } catch (error) {}
  };

  deleteActivity = async (activityId: string, appActivityId: string) => {
    try {
      await agent.Activities.delete(activityId);
      this.activities.delete(appActivityId);
    } catch (error) {}
  };

  hideActivity = async (activityId: string, appActivityId: string) => {
    try {
      await agent.Activities.hide(activityId);
      runInAction(() => {
        console.log(appActivityId);
        console.log(activityId);
        this.activities.delete(appActivityId);
      });
    } catch (error) {}
  };

  setActivity = (formValues: ActivityFormValues, resp: CreateActResp) => {
    const user = this.root.commonStore.user;
    const activity: ActivityMap = {
      ...formValues,
      id: resp.id,
      activityId: resp.activityId,
      photo: resp.photo,
      createdAt: resp.createdAt,
      modifiedAt: resp.createdAt,
      user: user,
      isLiked: false,
      comments: new Map<string, CommentMap>(),
      commentsCount: 0,
      sharesCount: 0,
      likes: 0,
    };
    this.activities.set(activity.id, activity);
  };

  getActivities = async () => {
    try {
      await agent.Activities.list().then((data) => {
        data.forEach((activity) => {
          const newActivity = {
            ...activity,
            comments: new Map<string, CommentMap>(),
          };
          runInAction(() => {
            this.activities.set(activity.id, newActivity);
          });
        });
      });
    } catch (error) {}
  };

  getActivity = async (appActivityId: string) => {
    const activity = this.activities.get(appActivityId);
    if (activity) this.activity = activity;
    else {
      const getActivity = await agent.Activities.get(appActivityId);
      const newActivity = {
        ...getActivity,
        comments: new Map<string, CommentMap>(),
      };
      this.activity = newActivity;
    }
  };

  activityLikeHandle = async (isLiked: boolean, activityId: string) => {
    try {
      if (!isLiked) await agent.Activities.like(activityId);
      else await agent.Activities.unlike(activityId);
    } catch (error) {}
  };

  shareActivity = async (activityId: string, appActivityId: string) => {
    try {
      const resp = await agent.Activities.share(activityId, appActivityId);

      const {
        id: userId,
        firstName,
        lastName,
        photo,
      } = this.root.commonStore.user;
      const user = {
        id: userId,
        firstName,
        lastName,
        photo,
      };
      const activity = this.activities.get(appActivityId);
      if (activity) {
        const newActivity = {
          ...activity,
          modifiedAt: resp.createdAt,
          id: resp.id,
          share: {
            user,
            createdAt: resp.createdAt,
            appActivityId,
          },
          SharesCount: activity.sharesCount + 1,
        };
        runInAction(() => {
          this.activities.set(newActivity.id, newActivity);
        });
      }
    } catch (error) {}
  };

  unshareActivity = async (appActivityId: string) => {
    try {
      await agent.Activities.unshare(appActivityId);
      runInAction(() => {
        this.activities.delete(appActivityId);
      });
    } catch (error) {}
  };
}
