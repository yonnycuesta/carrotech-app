export interface ICarResponse {
  id: string;
  plate: string;
  model: string;
  brand: string;
  color: string;
  capacity: number;
  assigned_date: Date;
  staff_name: string;
  staff_phone: string;
  staff_email: string;
  created_at: Date;
}


export interface ICarCreate {
  user_id: string;
  plate: string;
  model: string;
  brand: string;
  color: string;
  capacity: number;
  assigned_date: Date;
}
