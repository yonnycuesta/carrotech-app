export interface IItem {
  item_name: string;
  item_qty: number;
  item_code?: string;
}



export interface IOrderItem {
  order_id: string;
  items: IItem[];
}

export interface IOrdercCreate {
  user_id: string;
  // storage_manager_id: string;
  comment: string | null;
  zone: string | null;
  delivered_opt: string | null;
  // delivered_site: number;
  details: IItem[];
}

export interface IOrderStatus {
  order_id: string;
  statu: string;
  comment: string;
}


export interface IOrderSummary {
  status: string;
  count: number;
  icon: string;
  color: string;
}

export interface IOrderAdmin {
  id: string;
  comment: string;
  created_at: Date;
  code: string;
  staff_name: string;
  staff_phone: string;
  manager_name: string;
  manager_phone: string;
  statu: string;
  // delivery_time: Date;
}
