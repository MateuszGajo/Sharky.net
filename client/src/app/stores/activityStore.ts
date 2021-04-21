import {
  ActivityFormValues,
  CreateActResp,
  ActivityMap,
  Reply,
  CommentMap,
  Activity,
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
  activity: ActivityMap | undefined = undefined;

  isSubmitting = false;
  isRepliesLoading = false;
  commentId: string = "";
  activityId: string = "";
  isCommnetsLoading = false;

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
          this.activities.set(activity.id, newActivity);
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
        this.activities.set(newActivity.id, newActivity);
      }
    } catch (error) {}
  };

  unshareActivity = async (appActivityId: string) => {
    try {
      await agent.Activities.unshare(appActivityId);
      this.activities.delete(appActivityId);
    } catch (error) {}
  };

  getComments = async (activityId: string, appActivityId: string) => {
    this.isCommnetsLoading = true;
    this.activityId = activityId;
    try {
      const comments = await agent.Comments.get(activityId);
      const activity = this.activities.get(appActivityId);
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

  createComment = async (
    appActivityId: string,
    activityId: string,
    content: string
  ) => {
    try {
      const response = await agent.Comments.create(activityId, content);
      const activity = this.activities.get(appActivityId);
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
          isLiked: false,
        };
        this.setComment(appActivityId, comment);
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

  commentLikeHandle = async (isLiked: boolean, commentId: string) => {
    try {
      if (!isLiked) await agent.Comments.like(commentId);
      else await agent.Comments.unlike(commentId);
    } catch (error) {}
  };

  getReplies = async (activityId: string, commentId: string) => {
    this.isRepliesLoading = true;
    this.commentId = commentId;
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
        likes: 0,
        isHidden: false,
        isLiked: false,
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

  replyLikeHandle = async (isLiked: boolean, commentId: string) => {
    try {
      if (!isLiked) await agent.Replies.like(commentId);
      else await agent.Replies.unlike(commentId);
    } catch (error) {}
  };
}
