import {
  Activity,
  ActivityFormValues,
  CommentFormValues,
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

  setActivity = (formValues: ActivityFormValues, resp: CreateActResp) => {
    const user = this.root.commonStore.user;
    const activity: ActivityMap = {
      ...formValues,
      photo: resp.photo,
      createdAt: resp.date,
      user: user,
      isLiked: false,
      comments: new Map<string, CommentMap>(),
      likes: 0,
    };
    this.activities.set(activity.id, activity);
  };

  getActivities = async () => {
    try {
      await agent.Activities.get().then((data) => {
        data.forEach((activity) => {
          const comments = new Map<string, CommentMap>();
          activity.comments.forEach((comment: Comment) => {
            const replies = new Map<string, Reply>();
            comment.replies.forEach((reply: Reply) => {
              replies.set(reply.id, reply);
            });
            const newComment = {
              ...comment,
              replies,
            };
            comments.set(comment.id, newComment);
          });
          const newActivity = {
            ...activity,
            comments: comments,
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

  createComment = async (postId: string, formValues: CommentFormValues) => {
    try {
      const response = await agent.Activities.createComment(postId, formValues);
      const activity = this.activities.get(postId);
      if (activity) {
        const comments = activity.comments;
        const user = this.root.commonStore.user;
        const comment = {
          ...formValues,
          createdAt: response.date,
          author: user,
          likes: 0,
          replies: new Map<string, Reply>(),
        };
        comments.set(activity.id, comment);

        const newActivity = {
          ...activity,
          comments,
        };
        this.activities.set(activity.id, newActivity);
      }
    } catch (eror) {}
  };

  setComment = async (postId: string, commentId: string, content: string) => {
    const activity = this.activities.get(postId);
    const comment = activity?.comments.get(commentId);
    if (comment && activity) {
      comment.content = content;
      activity.comments.set(comment.id, comment);
    }
  };

  editComment = async (postId: string, commentId: string, content: string) => {
    try {
      await agent.Activities.editComment(postId, commentId, content);
      this.setComment(postId, commentId, content);
    } catch (error) {}
  };

  createReply = async (
    postId: string,
    commentId: string,
    formValues: CommentFormValues
  ) => {
    try {
      const response = await agent.Activities.createReply(
        postId,
        commentId,
        formValues
      );
    } catch (err) {}
  };
}
