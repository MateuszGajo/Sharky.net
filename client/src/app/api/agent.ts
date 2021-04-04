import {
  Activity,
  ActivityFormValues,
  CommentFormValues,
  CreateActResp,
} from "./../models/activity";
import {
  SigninFormValues,
  SignupFormValues,
} from "~root/src/app/models/authentication";
import axios, { AxiosResponse } from "axios";

axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

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
    formData.append("Id", activity.id);
    return axios
      .post<CreateActResp>("/activity/create", formData, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then(responseBody);
  },
  get: () => requests.get<Activity[]>("/activity"),
  like: (id: string) => requests.put<void>(`/activity/${id}/like`, {}),
  unLike: (id: string) => requests.put<void>(`/activity/${id}/unlike`, {}),
  createComment: (id: string, comment: CommentFormValues) =>
    requests.put<{ date: Date }>(`/activity/${id}/comment/create`, comment),
  editComment: (postId: string, commentId: string, content: string) =>
    requests.put<void>(`/activity/${postId}/comment/${commentId}/edit`, {
      content,
    }),
  createReply: (postId: string, commentId: string, reply: CommentFormValues) =>
    requests.put<{ createdAt: Date }>(
      `/activity/${postId}/comment/${commentId}/reply/create`,
      reply
    ),
};

export default { Account, Activities };
