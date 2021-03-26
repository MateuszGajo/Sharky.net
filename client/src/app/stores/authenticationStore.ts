import { store } from "./store";
import agent from "~api/agent";
import { makeAutoObservable } from "mobx";
import { SignupFormValues as SignupValues } from "~root/src/app/models/user";
import { SigninFormValues as SigninValues } from "~root/src/app/models/user";
import router from "next/router";

export default class AuthenticationStore {
  constructor() {
    makeAutoObservable(this);
  }

  page = 1;
  numberOfPages = 0;
  loading = true;
  initialFormValues = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  touchedFields = {};
  creds = { email: "", password: "" };
  remebermeStatus = false;

  setNumberOfPages = (number: number) => {
    this.numberOfPages = number;
  };

  nextPage = () => {
    this.page = this.page + 1;
  };

  previousPage = () => {
    this.page = this.page - 1;
  };

  setLoading = (state: boolean) => {
    this.loading = state;
  };

  loadRegisterValues = () => {
    const values = sessionStorage.getItem("registerFormValues");

    if (values) {
      try {
        const valuesParsed = JSON.parse(values);
        const touchedFields: typeof valuesParsed = {};
        for (const [key, value] of Object.entries(valuesParsed)) {
          touchedFields[key as keyof typeof touchedFields] = value
            ? true
            : false;
        }
        this.touchedFields = touchedFields;
        this.initialFormValues = { ...this.initialFormValues, ...valuesParsed };
      } catch (e) {
        console.log("catch");
      }
    }
    this.setLoading(false);
  };

  register = (
    user: SignupValues,
    setErrors: (fields: {}) => void,
    setTouched: (fields: {}, shouldValidate: boolean) => void,
    setStatus: (status: any) => void,
    setStatusOfSaveValues: (shouldSave: boolean) => void
  ) => {
    agent.Account.register(user)
      .then(() => {
        sessionStorage.removeItem("registerFormValues");
        setStatusOfSaveValues(false);
        router.push("/home");
      })
      .catch((err) => {
        const errors = err.response.data.errors;
        const touched: typeof errors = {};
        const initialFormExtend: typeof errors = this.initialFormValues;
        console.log(errors);
        for (const [key, value] of Object.entries(errors)) {
          const lower = key.toLocaleLowerCase();
          console.log(initialFormExtend[lower]);
          console.log(initialFormExtend["Das"]);
          touched[lower] = value ? true : false;
          if (initialFormExtend[lower] == "undefined") {
            setStatus("serverError");
          }

          if (lower !== key) {
            errors[lower] = errors[key];
            delete errors[key];
          }
        }
        setErrors(errors);
        setTouched(touched, false);
      });
  };

  login = (
    creds: SigninValues,
    setFieldError: (msg: string) => void,
    isChecked: boolean
  ) => {
    agent.Account.login(creds, isChecked ? "true" : "false")
      .then(() => {
        if (isChecked) localStorage.setItem("creds", "true");
        else {
          localStorage.removeItem("creds");
        }
        router.push("/home");
      })
      .catch((err) => {
        const errors = err.response.data.errors;
        if (errors["error"]) {
          setFieldError("credsError");
        }
      });
  };

  getCreds = () => {
    if (localStorage.getItem("creds")) {
      agent.Account.creds()
        .then(({ data }) => {
          this.creds = data;
          this.remebermeStatus = true;
        })
        .catch(() => {
          localStorage.removeItem("creds");
        })
        .finally(() => (this.loading = false));
    } else {
      this.loading = false;
    }
  };

  setRemeberme = (status: boolean) => {
    this.remebermeStatus = status;
  };
}
