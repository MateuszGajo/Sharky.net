import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { CommentMap, Reply, User } from "../models/activity";
import { RootStore } from "./RootStore";

export default class CommentStore {
  root: RootStore;
  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }
  isLoading = false;
  activityId = "";

  getComments = async (activityId: string, appActivityId: string) => {
    this.isLoading = true;
    this.activityId = activityId;
    try {
      const comments = await agent.Comments.get(activityId);
      const activity = this.root.activityStore.activities.get(appActivityId);
      comments.forEach((item) => {
        const newComment = {
          ...item,
          replies: new Map<string, Reply>(),
        };
        runInAction(() => {
          activity?.comments.set(item.id, newComment);
        });
      });
      runInAction(() => {
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  createComment = async (
    appActivityId: string,
    activityId: string,
    content: string
  ) => {
    try {
      const {
        value: { id, createdAt },
      } = await this.root.commonStore.hubConnection?.invoke(
        "CreateComment",
        activityId,
        content
      );
      const activity = this.root.activityStore.activities.get(appActivityId);
      if (activity) {
        const user = this.root.commonStore.user;
        const comment = {
          content,
          id: id,
          createdAt: createdAt,
          author: user,
          likes: 0,
          replies: new Map<string, Reply>(),
          repliesCount: 0,
          isHidden: false,
          isLiked: false,
        };
        runInAction(() => {
          this.setComment(appActivityId, comment);
        });
      }
    } catch (error) {}
  };

  createCommentListener = (path: string) => {
    this.root.commonStore.hubConnection?.on(
      "commentAdded",
      (notifyId: string, activityId: string, user: User, createdAt: Date) => {
        if (path == "/notifications") {
          const newNotification = {
            id: notifyId,
            user: user,
            type: "comment",
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

  setComment = async (activityId: string, comment: CommentMap) => {
    const activity = this.root.activityStore.activities.get(activityId);
    if (comment && activity) {
      runInAction(() => {
        activity.comments.set(comment.id, comment);
      });
    }
  };

  editComment = async (
    activityId: string,
    commentId: string,
    content: string
  ) => {
    try {
      await agent.Comments.edit(commentId, content);
      const comment = this.root.activityStore.activities
        .get(activityId)
        ?.comments.get(commentId);
      if (comment) {
        comment.content = content;
        runInAction(() => {
          this.setComment(activityId, comment);
        });
      }
    } catch (error) {}
  };

  hideComment = async (commentId: string) => {
    try {
      await agent.Comments.hide(commentId);
    } catch (error) {}
  };

  unhideComment = async (commentId: string) => {
    try {
      await agent.Comments.unHide(commentId);
    } catch (error) {}
  };

  commentLikeHandle = async (isLiked: boolean, commentId: string) => {
    try {
      if (!isLiked) await agent.Comments.like(commentId);
      else await agent.Comments.unlike(commentId);
    } catch (error) {}
  };
}
