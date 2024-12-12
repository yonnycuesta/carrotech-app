export interface IOrderItem {
  code: string;
  name: string;
  qty: number;
}

export interface ICalendar {
  delivered_date: string | null;
  start_time: string | null;
  end_time: string | null;
}

export interface IOrderData {
  id: string;
  code: string;
  comment: string;
  shift: number;
  staff_name: string;
  staff_dni: string;
  manager_name: string;
  manager_dni: string;
  statu_es: string;
  delivered_opt: string;
  delivered_site: string;
  mocode: string | null;
  created_at: string;
  calendar: ICalendar;
  items: IOrderItem[];
}
