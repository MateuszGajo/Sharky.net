import {
  ActivityFormValues,
  CreateActResp,
  ActivityMap,
  CommentMap,
  User,
} from "./../models/activity";
import { makeAutoObservable, runInAction } from "mobx";
import agent from "~api/agent";
import { RootStore } from "./RootStore";

export default class AcitivtyStore {
  root: RootStore;
  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  activities = new Map<string, ActivityMap>();
  activity: ActivityMap | undefined = undefined;
  isSubmitting = false;
  isLoading = false;

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
      runInAction(() => {
        this.setActivity(activity, resp);

        this.root.commonStore.hubConnection?.invoke(
          "ActivityAdded",
          resp.id,
          resp.notifyId
        );
        this.isSubmitting = false;
      });
    } catch (error) {
      runInAction(() => {
        this.isSubmitting = false;
      });
    }
  };

  activityListener = (path: string) => {
    this.root.commonStore.hubConnection?.on(
      "activityAdded",
      (notifyId: string, activityId: string, user: User, createdAt: Date) => {
        if (path == "/notifications") {
          const newNotification = {
            id: notifyId,
            user: user,
            type: "post",
            action: "added",
            createdAt: createdAt,
            refId: activityId,
          };
          this.root.notificationStore.notifications.set(
            newNotification.id,
            newNotification
          );
        } else {
          this.root.commonStore.notificationCount += 1;
        }
      }
    );
  };

  editActivity = async (
    editedActivity: ActivityFormValues,
    activityId: string,
    appActivityId: string
  ) => {
    this.isSubmitting = true;
    try {
      const resp = await agent.Activities.edit(editedActivity, activityId);
      runInAction(() => {
        const activity = this.activities.get(appActivityId);
        if (activity) {
          const newActivity = {
            ...activity,
            photo: resp.photo ? resp.photo : activity?.photo,
            content: editedActivity.content,
          };
          this.activities.set(appActivityId, newActivity);
        }
      });
    } catch (error) {}
  };

  deleteActivity = async (activityId: string, appActivityId: string) => {
    try {
      await agent.Activities.delete(activityId);
      runInAction(() => {
        this.activities.delete(appActivityId);
      });
    } catch (error) {}
  };

  hideActivity = async (activityId: string, appActivityId: string) => {
    try {
      await agent.Activities.hide(activityId);
      runInAction(() => {
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
      const data = await agent.Activities.list();
      runInAction(() => {
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
    this.isLoading = true;
    const activity = this.activities.get(appActivityId);
    if (activity) {
      this.activity = activity;
      this.isLoading = false;
    } else {
      const getActivity = await agent.Activities.get(appActivityId);
      runInAction(() => {
        const newActivity = {
          ...getActivity,
          comments: new Map<string, CommentMap>(),
        };
        this.activity = newActivity;
        this.isLoading = false;
      });
    }
  };

  activityLikeHandle = async (isLiked: boolean, activityId: string) => {
    try {
      if (!isLiked) {
        this.root.commonStore.hubConnection?.invoke("LikeActivity", activityId);
      } else await agent.Activities.unlike(activityId);
    } catch (error) {}
  };

  likeListener = (path: string) => {
    this.root.commonStore.hubConnection?.on(
      "activityLiked",
      (notifyId: string, activityId: string, user: User, createdAt: Date) => {
        if (path == "/notifications") {
          const newNotification = {
            id: notifyId,
            user: user,
            type: "post",
            action: "liked",
            createdAt: createdAt,
            refId: activityId,
          };
          this.root.notificationStore.notifications.set(
            newNotification.id,
            newNotification
          );
        } else {
          this.root.commonStore.notificationCount += 1;
        }
      }
    );
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
