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

  editActivity = async (editedActivity: ActivityFormValues, postId: string) => {
    this.isSubmitting = true;
    try {
      const resp = await agent.Activities.edit(editedActivity, postId);
      const activity = this.activities.get(postId);
      if (activity) {
        const newActivity = {
          ...activity,
          photo: resp.photo ? resp.photo : activity?.photo,
          content: editedActivity.content,
        };
        this.activities.set(postId, newActivity);
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
        console.log(data);
        data.forEach((activity) => {
          // const comments = new Map<string, CommentMap>();
          // activity.comments.forEach((comment: Comment) => {
          //   const replies = new Map<string, Reply>();
          //   comment.replies.forEach((reply: Reply) => {
          //     replies.set(reply.id, reply);
          //   });
          //   const newComment = {
          //     ...comment,
          //     replies,
          //   };
          //   comments.set(comment.id, newComment);
          // });
          const newActivity = {
            ...activity,
            comments: new Map<string, CommentMap>(),
          };
          this.activities.set(activity.id, newActivity);
        });
      });
    } catch (error) {}
  };

  getComments = async (postId: string) => {
    try {
      const comments = await agent.Comments.get(postId);
      // const commentsMap = new Map<string, CommentMap>();
      const activity = this.activities.get(postId);
      comments.forEach((item) => {
        const newComment = {
          ...item,
          replies: new Map<string, Reply>(),
        };
        activity?.comments.set(item.id, newComment);
      });
    } catch (error) {}
  };

  likeHandle = async (isLiked: boolean, activityId: string) => {
    try {
      if (!isLiked) await agent.Activities.like(activityId);
      else await agent.Activities.unLike(activityId);
    } catch (error) {}
  };

  createComment = async (postId: string, content: string) => {
    try {
      const response = await agent.Comments.create(postId, content);
      const activity = this.activities.get(postId);
      if (activity) {
        const user = this.root.commonStore.user;
        const comment = {
          content,
          id: response.id,
          createdAt: response.createdAt,
          author: user,
          likes: 0,
          replies: new Map<string, Reply>(),
        };
        this.setComment(postId, comment);
      }
    } catch (eror) {}
  };

  setComment = async (postId: string, comment: CommentMap) => {
    const activity = this.activities.get(postId);
    if (comment && activity) {
      activity.comments.set(comment.id, comment);
    }
  };

  editComment = async (postId: string, commentId: string, content: string) => {
    try {
      await agent.Comments.edit(commentId, content);
      const comment = this.activities.get(postId)?.comments.get(commentId);
      if (comment) {
        comment.content = content;
        this.setComment(postId, comment);
      }
    } catch (error) {}
  };

  hideComment = async (postId: string, commentId: string) => {
    try {
      await agent.Comments.hide(commentId);
      const comments = this.activities.get(postId)?.comments;
      comments?.delete(commentId);
    } catch (error) {}
  };

  createReply = async (postId: string, commentId: string, content: string) => {
    try {
      const response = await agent.Replies.create(postId, commentId, content);
      const user = this.root.commonStore.user;
      var reply = {
        id: response.id,
        createdAt: response.createdAt,
        content,
        author: user,
      };
      this.setReply(postId, commentId, reply);
    } catch (err) {}
  };

  setReply = (postId: string, commentId: string, reply: Reply) => {
    const activity = this.activities.get(postId);
    const comments = activity?.comments;
    const comment = comments?.get(commentId);
    const replies = comment?.replies;
    if (replies && comments && comment) {
      replies.set(reply.id, reply);
    }
  };
}
