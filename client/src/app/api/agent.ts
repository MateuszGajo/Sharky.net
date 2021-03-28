import { Activity } from "./../models/activity";
import { SigninFormValues, SignupFormValues } from "~models/user";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;

const requests = {
  get: (url: string) => axios.get(url),
  post: (url: string, body: {}) => axios.post(url, body),
  put: (url: string, body: {}) => axios.put(url, body),
  delete: (url: string) => axios.delete(url),
};

const Account = {
  login: (user: SigninFormValues, predicate: string) =>
    requests.post(`/user/login?predicate=${predicate}`, user),
  register: (user: SignupFormValues) => requests.post("/user/register", user),
  creds: () => requests.post("user/creds", {}),
  fbLogin: (accessToken: string) =>
    requests.post(`user/facebook`, { accessToken }),
  logout: () => requests.delete("/user/logout"),
};

const Activities = {
  create: (activity: Activity) => {
    let formData = new FormData();
    formData.append("File", activity.file);
    formData.append("Content", activity.content);
    return axios.post("/activity/create", formData, {
      headers: { "Content-type": "multipart/form-data" },
    });
  },
  get: () => requests.get("/activity"),
};

export default { Account, Activities };
