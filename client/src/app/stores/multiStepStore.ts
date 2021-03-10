import { makeAutoObservable } from "mobx";

export default class MultiStepStore {
  constructor() {
    makeAutoObservable(this);
  }

  page = 1;
  numberOfPages: number;

  setNumberOfPages = (number: number) => {
    this.numberOfPages = number;
  };

  nextPage = () => {
    console.log("gościu klikam");
    this.page = this.page + 1;
  };

  previousPage = () => {
    this.page = this.page - 1;
  };
}
