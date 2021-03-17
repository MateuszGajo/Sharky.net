import agent from "~api/agent";
import { makeAutoObservable } from "mobx";
import { SignupFormValues as FormValue } from "~root/src/app/models/user";
import router from "next/router";

export default class MultiStepStore {
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

  loadInitialFormValues = () => {
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

  handleSubmitForm = (
    user: FormValue,
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

        for (const [key, value] of Object.entries(errors)) {
          touched[key] = value ? true : false;
          console.log(errors[key]);
          if (!initialFormExtend[key]) {
            console.log("errorus?");
            setStatus("serverError");
          }
        }
        setErrors(errors);
        setTouched(touched, false);
      });
  };
}
