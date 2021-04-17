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
  get: () => requests.get<Activity[]>("/activity"),
  hide: (id: string) => requests.put(`activity/${id}/hide`, {}),
  like: (id: string) => requests.put<void>(`/activity/${id}/like`, {}),
  unLike: (id: string) => requests.put<void>(`/activity/${id}/unlike`, {}),
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
};

const User = {
  block: (id: string) => requests.put<void>(`user/${id}/block`, {}),
};

export default { Account, Activities, Comments, Replies, User };
