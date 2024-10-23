import { User } from './user-interface';

export interface ICheckTokenResponse {
  token: string;
  user: User;
}
