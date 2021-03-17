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
};

export default { Account };
