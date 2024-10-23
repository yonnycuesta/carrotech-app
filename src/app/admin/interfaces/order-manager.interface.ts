export interface IOrderManager {
  id: string;
  storage_manager_id: string;
  comment: string;
  created_at: Date;
  code: string;
  staff_name: string;
  shift: number;
  statu: string;
  delivery_time: null;
  updated_at: null;
}


export interface IOrderApproved {
  // statu: string;
  comment: string;
  storage_manager_id: string;
  order_id: string;
  delivery_time: Date;
  summaries: Summary[];
}

export interface Summary {
  // storage_manager_id: string;
  // order_id: string;
  item_id: string;
  qty_requested: number;
  qty_delivered: number;
  qty_pending: number;
}
