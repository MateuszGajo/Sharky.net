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
import { Friend, GetFriends, OnlineFriend, UserList } from "../models/user";
import { ConversationItem, Message } from "../models/conversation";
import {
  Notification as NotificationI,
  NotificationCount,
} from "~root/src/app/models/notification";
import { General, EditGeneral, Security, BlockUser } from "../models/setting";

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
  get: (start: number, filterText: string | undefined) =>
    requests.get<UserList[]>(
      `/user?start=${start}${filterText ? `&filter=${filterText}` : ""}`
    ),
  readNotification: () => requests.put<void>("/user/notification/read", {}),
  Unblock: (id: string) => requests.delete<void>(`/user/${id}/unblock`),
};

interface GetFriendsExtend extends GetFriends {
  from: number;
}

const Friends = {
  get: ({ id, filterText, from }: GetFriendsExtend) =>
    requests.get<Friend[]>(
      `/friends?from=${from}${filterText ? `&filter=${filterText}` : ""}
      ${id ? `&userId=${id}` : ""}`
    ),
  getOnline: () => requests.get<OnlineFriend[]>("/friends/online"),
  unfriend: (friendshipId: string) =>
    requests.delete<void>(`/friends/${friendshipId}`),
  add: (id: string) => requests.post<void>(`/friends/${id}/add`, {}),
  acceptRequest: (friendshipId: string, notifyId: string) =>
    requests.put(`friends/${friendshipId}/accept`, { notifyId }),
  declineRequest: (friendshipId: string, notifyId: string) =>
    requests.put(`friends/${friendshipId}/decline`, { notifyId }),
};

const Conversation = {
  get: (from: number) =>
    requests.get<ConversationItem[]>(`/conversation?from=${from}`),
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

const Notifications = {
  get: () => requests.get<NotificationI[]>("/notification"),
};

const Settings = {
  getGeneral: () => requests.get<General>("/settings/general"),
  editGeneral: ({ firstname = "", lastname = "" }: EditGeneral) =>
    requests.put<void>("/settings/general/edit", { firstname, lastname }),
  editEmail: (email: string, newEmail: string) =>
    requests.put("/settings/email/edit", { email, newEmail }),
  editPassword: (currentPassword: string, newPassword: string) =>
    requests.put("/settings/password/edit", { currentPassword, newPassword }),
  blockedUsersList: () => requests.get<BlockUser[]>("/settings/user/blocked"),
};

export default {
  Account,
  Activities,
  Comments,
  Replies,
  User,
  Friends,
  Conversation,
  Notifications,
  Settings,
};
