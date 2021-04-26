import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Reply } from "../models/activity";
import { RootStore } from "./rootStore";

export default class ReplyStore {
  root: RootStore;
  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  isLoading = false;
  commentId = "";

  getReplies = async (activityId: string, commentId: string) => {
    this.isLoading = true;
    this.commentId = commentId;
    try {
      const replies = await agent.Replies.get(commentId);
      const comment = this.root.activityStore.activities
        .get(activityId)
        ?.comments.get(commentId);
      replies.forEach((item) => {
        runInAction(() => {
          comment?.replies.set(item.id, item);
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
      runInAction(() => {
        this.setReply(activityId, commentId, reply);
      });
    } catch (err) {}
  };

  setReply = (activityId: string, commentId: string, reply: Reply) => {
    const activity = this.root.activityStore.activities.get(activityId);
    const comments = activity?.comments;
    const comment = comments?.get(commentId);
    const replies = comment?.replies;
    if (replies && comments && comment) {
      runInAction(() => {
        replies.set(reply.id, reply);
      });
    }
  };

  deleteReply = async (
    activityId: string,
    commentId: string,
    replyId: string
  ) => {
    try {
      await agent.Replies.delete(replyId);
      const replies = this.root.activityStore.activities
        .get(activityId)
        ?.comments.get(commentId)?.replies;
      runInAction(() => {
        replies?.delete(replyId);
      });
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
