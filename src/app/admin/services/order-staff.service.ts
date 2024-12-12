import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IItem, IOrdercCreate, IOrderItem, IOrderStatus } from '../interfaces/order-interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderStaffService {
  private readonly url: string = environment.apiURL;

  constructor(private _http: HttpClient) { }
  index(staff_id: any): Observable<any> {
    return this._http.get(`${this.url}orders-staff/all/${staff_id}`);
  }
  indexOpened(staff_id: any): Observable<any> {
    return this._http.get(`${this.url}orders-staff/all-opened/${staff_id}`);
  }
  indexApproved(staff_id: any): Observable<any> {
    return this._http.get(`${this.url}orders-staff/all-approved/${staff_id}`);
  }
  indexPrepared(staff_id: any): Observable<any> {
    return this._http.get(`${this.url}orders-staff/all-prepared/${staff_id}`);
  }
  indexCompleted(staff_id: any): Observable<any> {
    return this._http.get(`${this.url}orders-staff/all-completed/${staff_id}`);
  }

  indexPending(staff_id: any): Observable<any> {
    return this._http.get(`${this.url}orders-staff/all-pending-toconfirmed/${staff_id}`);
  }


  storeItems(id: string, items: IOrderItem) {
    return this._http.post(`${this.url}orders-staff/add-item/${id}`, items);
  }

  updateItems(id: string, items: IItem) {
    return this._http.patch(`${this.url}orders-staff/update-item/${id}`, items);
  }
  deleteItem(id: string) {
    return this._http.delete(`${this.url}orders-staff/delete-item/${id}`);
  }

  storeOrder(order: IOrdercCreate) {
    return this._http.post(`${this.url}orders-staff/`, order);
  }

  updateStatus(id: string, data: IOrderStatus) {
    return this._http.put(`${this.url}orders-staff/statu-change/${id}`, data);
  }
}
