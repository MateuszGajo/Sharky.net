import {
  ActivityFormValues,
  CreateActResp,
  Comment,
  ActivityMap,
  Reply,
  CommentMap,
} from "./../models/activity";
import { makeAutoObservable } from "mobx";
import agent from "~api/agent";
import { RootStore } from "./rootStore";

export default class AcitivtyStore {
  root: RootStore;
  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  activities = new Map<string, ActivityMap>();

  isSubmitting = false;
  isRepliesLoading = false;
  isCommnetsLoading = false;

  get activitiesByDate() {
    return Array.from(this.activities.values()).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  createActivity = async (activity: ActivityFormValues) => {
    this.isSubmitting = true;
    try {
      const resp = await agent.Activities.create(activity);
      this.setActivity(activity, resp);
      this.isSubmitting = false;
    } catch (error) {
      this.isSubmitting = false;
    }
  };

  editActivity = async (
    editedActivity: ActivityFormValues,
    activityId: string
  ) => {
    this.isSubmitting = true;
    try {
      const resp = await agent.Activities.edit(editedActivity, activityId);
      const activity = this.activities.get(activityId);
      if (activity) {
        const newActivity = {
          ...activity,
          photo: resp.photo ? resp.photo : activity?.photo,
          content: editedActivity.content,
        };
        this.activities.set(activityId, newActivity);
      }
    } catch (error) {}
  };

  deleteActivity = async (id: string) => {
    try {
      await agent.Activities.delete(id);
      this.activities.delete(id);
    } catch (error) {}
  };

  hideActivity = async (id: string) => {
    try {
      await agent.Activities.hide(id);
      this.activities.delete(id);
    } catch (error) {}
  };

  setActivity = (formValues: ActivityFormValues, resp: CreateActResp) => {
    const user = this.root.commonStore.user;
    const activity: ActivityMap = {
      ...formValues,
      id: resp.id,
      photo: resp.photo,
      createdAt: resp.createdAt,
      user: user,
      isLiked: false,
      comments: new Map<string, CommentMap>(),
      commentsCount: 0,
      likes: 0,
    };
    this.activities.set(activity.id, activity);
  };

  getActivities = async () => {
    try {
      await agent.Activities.get().then((data) => {
        data.forEach((activity) => {
          const newActivity = {
            ...activity,
            comments: new Map<string, CommentMap>(),
          };
          this.activities.set(activity.id, newActivity);
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

  getComments = async (activityId: string) => {
    this.isCommnetsLoading = true;
    try {
      const comments = await agent.Comments.get(activityId);
      const activity = this.activities.get(activityId);
      comments.forEach((item) => {
        const newComment = {
          ...item,
          replies: new Map<string, Reply>(),
        };
        activity?.comments.set(item.id, newComment);
      });
      this.isCommnetsLoading = false;
    } catch (error) {
      this.isCommnetsLoading = false;
    }
  };

  createComment = async (activityId: string, content: string) => {
    try {
      const response = await agent.Comments.create(activityId, content);
      const activity = this.activities.get(activityId);
      if (activity) {
        const user = this.root.commonStore.user;
        const comment = {
          content,
          id: response.id,
          createdAt: response.createdAt,
          author: user,
          likes: 0,
          replies: new Map<string, Reply>(),
          repliesCount: 0,
          isHidden: false,
        };
        this.setComment(activityId, comment);
      }
    } catch (eror) {}
  };

  setComment = async (activityId: string, comment: CommentMap) => {
    const activity = this.activities.get(activityId);
    if (comment && activity) {
      activity.comments.set(comment.id, comment);
    }
  };

  editComment = async (
    activityId: string,
    commentId: string,
    content: string
  ) => {
    try {
      await agent.Comments.edit(commentId, content);
      const comment = this.activities.get(activityId)?.comments.get(commentId);
      if (comment) {
        comment.content = content;
        this.setComment(activityId, comment);
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

  getReplies = async (activityId: string, commentId: string) => {
    this.isRepliesLoading = true;
    try {
      const replies = await agent.Replies.get(commentId);
      const comment = this.activities.get(activityId)?.comments.get(commentId);
      replies.forEach((item) => {
        comment?.replies.set(item.id, item);
      });
      this.isRepliesLoading = false;
    } catch (error) {
      this.isRepliesLoading = false;
    }
  };

  createReply = async (
    activityId: string,
    commentId: string,
    content: string
  ) => {
    try {
      const response = await agent.Replies.create(commentId, content);
      const user = this.root.commonStore.user;
      var reply = {
        id: response.id,
        createdAt: response.createdAt,
        content,
        author: user,
        isHidden: false,
      };
      this.setReply(activityId, commentId, reply);
    } catch (err) {}
  };

  setReply = (activityId: string, commentId: string, reply: Reply) => {
    const activity = this.activities.get(activityId);
    const comments = activity?.comments;
    const comment = comments?.get(commentId);
    const replies = comment?.replies;
    if (replies && comments && comment) {
      replies.set(reply.id, reply);
    }
  };

  deleteReply = async (
    activityId: string,
    commentId: string,
    replyId: string
  ) => {
    try {
      await agent.Replies.delete(replyId);
      const replies = this.activities.get(activityId)?.comments.get(commentId)
        ?.replies;
      replies?.delete(replyId);
    } catch (error) {}
  };

  hideReply = async (replyId: string) => {
    try {
      await agent.Replies.hide(replyId);
    } catch (error) {}
  };

  unhideReply = async (replyId: string) => {
    try {
      await agent.Replies.unhide(replyId);
    } catch (error) {}
  };
}
