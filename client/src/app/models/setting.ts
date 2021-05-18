import { User } from "./activity";

export interface General {
  firstname: string;
  lastname: string;
}

export interface Security {
  email: string;
}

export interface EditGeneral {
  firstname?: string;
  lastname?: string;
}

export interface BlockUser {
  id: string;
  user: User;
}
