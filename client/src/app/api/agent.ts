import {
  Activity,
  Comment,
  ActivityFormValues,
  CreateActResp,
  CreateCommResp,
  Reply,
} from "./../models/activity";
import {
  SigninFormValues,
  SignupFormValues,
} from "~root/src/app/models/authentication";
import axios, { AxiosResponse } from "axios";
import { Friend } from "../models/user";
import { Message } from "../models/conversation";
import {
  Notification as NotificationI,
  NotificationCount,
} from "~root/src/app/models/notification";

axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const sleep = (delay: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, delay);
  });

axios.interceptors.response.use(async (response) => {
  await sleep(1000);
  return response;
});

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) =>
    axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Account = {
  login: (user: SigninFormValues, predicate: string) =>
    requests.post<void>(`/user/login?predicate=${predicate}`, user),
  register: (user: SignupFormValues) =>
    requests.post<void>("/user/register", user),
  creds: () => requests.post<SigninFormValues>("user/creds", {}),
  logout: () => requests.delete<void>("/user/logout"),
};

const Activities = {
  create: (activity: ActivityFormValues) => {
    let formData = new FormData();
    formData.append("File", activity.file);
    formData.append("Content", activity.content);
    return axios
      .post<CreateActResp>("/activity/create", formData, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then(responseBody);
  },
  edit: (activity: ActivityFormValues, activityId: string) => {
    let formData = new FormData();
    formData.append("File", activity.file);
    formData.append("Content", activity.content);
    return axios
      .put<{ photo: { url: string; id: string } }>(
        `/activity/${activityId}/edit`,
        formData,
        {
          headers: { "Content-type": "multipart/form-data" },
        }
      )
      .then(responseBody);
  },
  delete: (id: string) => requests.delete<void>(`/activity/${id}`),
  list: () => requests.get<Activity[]>("/activity"),
  get: (id: string) => requests.get<Activity>(`/activity/${id}`),
  hide: (id: string) => requests.put(`activity/${id}/hide`, {}),
  like: (id: string) => requests.put<void>(`/activity/${id}/like`, {}),
  unlike: (id: string) => requests.delete<void>(`/activity/${id}/unlike`),
  share: (activityId: string, appActivityId: string) =>
    requests.put<{ id: string; createdAt: Date }>(
      `/activity/${activityId}/share`,
      { appActivityId }
    ),
  unshare: (id: string) => requests.delete<void>(`/activity/${id}/unshare`),
};

const Comments = {
  get: (activityId: string) =>
    requests.get<Comment[]>(`/comment?ActivityId=${activityId}`),
  create: (id: string, content: string) =>
    requests.put<CreateCommResp>(`comment/create`, {
      content,
      activityId: id,
    }),
  edit: (id: string, content: string) =>
    requests.put<void>(`comment/${id}/edit`, {
      content,
    }),
  hide: (id: string) => requests.put<void>(`comment/${id}/hide`, {}),
  unHide: (id: string) => requests.delete<void>(`comment/${id}/unhide`),
  like: (id: string) => requests.put<void>(`/comment/${id}/like`, {}),
  unlike: (id: string) => requests.delete<void>(`/comment/${id}/unlike`),
};

const Replies = {
  get: (commentId: string) =>
    requests.get<Reply[]>(`/reply?CommentId=${commentId}`),
  create: (commentId: string, content: string) =>
    requests.post<CreateCommResp>(`reply/create`, {
      content,
      commentId,
    }),
  delete: (replyId: string) => requests.delete<void>(`/reply/${replyId}`),
  hide: (replyId: string) => requests.put<void>(`/reply/${replyId}/hide`, {}),
  unhide: (replyId: string) =>
    requests.delete<void>(`/reply/${replyId}/unhide`),
  like: (id: string) => requests.put<void>(`/reply/${id}/like`, {}),
  unlike: (id: string) => requests.delete<void>(`/reply/${id}/unlike`),
};

const User = {
  block: (id: string) => requests.put<void>(`user/${id}/block`, {}),
  report: (id: string, reasons: string[]) =>
    requests.post(`/user/${id}/report`, { reasons }),
  getNotification: () => requests.get<NotificationCount>("/user/notification"),
  readNotification: () => requests.put<void>("/user/notification/read", {}),
};

const Friends = {
  get: () => requests.get<Friend[]>("/user/friends"),
};

const Conversation = {
  create: (friendshipId: string, userId: string, message: string) =>
    requests.post<{ id: string; conversationId: string; createdAt: Date }>(
      "/conversation/create",
      {
        friendshipId,
        recipientId: userId,
        message,
      }
    ),
  getMessages: (conversationId: string, start: number) =>
    requests.get<Message[]>(
      `/conversation/${conversationId}/messages?start=${start}`
    ),
  addMessage: (conversationId: string, message: string) =>
    requests.put<{ id: string; createdAt: Date; friendId: string }>(
      `conversation/${conversationId}/message/add`,
      { message }
    ),
  readMessages: (conversationId: String) =>
    requests.put<void>(`/conversation/${conversationId}/messages/read`, {}),
};

const Notification = {
  get: () => requests.get<NotificationI[]>("/notification"),
};

export default {
  Account,
  Activities,
  Comments,
  Replies,
  User,
  Friends,
  Conversation,
  Notification,
};
