import { SigninFormValues, SignupFormValues } from "~models/user";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000/api";

const requests = {
  get: (url: string) => axios.get(url),
  post: (url: string, body: {}) => axios.post(url, body),
  put: (url: string, body: {}) => axios.put(url, body),
  delete: (url: string) => axios.delete(url),
};

const Account = {
  login: (user: SigninFormValues) => requests.post("/user/login", user),
  register: (user: SignupFormValues) => requests.post("/user/register", user),
};

export default { Account };
