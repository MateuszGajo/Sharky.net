export interface SignupFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface SigninFormValues {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface Token {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  nbf: number;
  exp: number;
  iat: number;
}
