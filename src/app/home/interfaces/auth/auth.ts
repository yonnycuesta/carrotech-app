import { User } from './user-interface';

export interface IRegister {
  name: string;
  lastname: string;
  email: string;
  cellphone: string;
  password: string;
  password_confirmation: string;
}

export interface ILoginResponse {
  user: User;
  token: string;
}

export interface UserWithToken extends User {
  token: string;
}
