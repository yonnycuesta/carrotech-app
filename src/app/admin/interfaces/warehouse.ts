import { IItem } from "./order-interface";
import { Summary } from "./order-manager.interface";

export interface IOrderItem {
  user_id?: string;
  order_id: string;
  items: IItem[];
}


export interface IOrderApproved {
  comment?: string;
  order_id: string;
  user_id?: string;
  summaries: Summary[];
}


export interface IOrderManager {
  id: string;
  storage_manager_id: string;
  comment: string;
  created_at: Date;
  code: string;
  mocode: string;
  staff_name: string;
  shift: number;
  statu: string;
  delivery_time: null;
  updated_at: null;
}
