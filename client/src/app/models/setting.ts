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
