export interface IUser {
  id: string;
  name: string;
  dni: string;
  email: string;
  phone: string;
  role: string;
  statu: string;
}

export interface IUserDisplayColumn {
  def: string;
  label: string;
  hide: boolean;
}
