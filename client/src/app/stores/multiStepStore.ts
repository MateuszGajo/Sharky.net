import { makeAutoObservable } from "mobx";

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
}
