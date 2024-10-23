import { computed, inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../home/services/auth/auth.service';
import { IOrderApproved } from '../interfaces/order-manager.interface';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderStoragaManagerService {

  private authService = inject(AuthService);
  public user = computed(() => this.authService.currentUser());

  private readonly url: string = environment.apiURL;

  constructor(private _http: HttpClient) { }

  index(manager_id: any, statu: string): Observable<any> {
    return this._http.get(`${this.url}orders-storage_manager/all/${manager_id}/${statu}`);
  }

  indexOpenend(manager_id: string): Observable<any> {
    return this._http.get(`${this.url}orders-storage_manager/all-opened/${manager_id}`);
  }

  indexApproved(manager_id: string): Observable<any> {
    return this._http.get(`${this.url}orders-storage_manager/all-approved/${manager_id}`);
  }

  indexCompleted(manager_id: string): Observable<any> {
    return this._http.get(`${this.url}orders-storage_manager/all-completed/${manager_id}`);
  }


  getOrder(id: string) {
    return this._http.get(`${this.url}orders-storage_manager/${id}`);
  }

  approvedOrder(id: string, data: IOrderApproved) {
    return this._http.put(`${this.url}orders-storage_manager/order-approved/${id}`, data);
  }

  show(id: string) {
    return this._http.get(`${this.url}orders-storage_manager/${id}`);
  }

  // TODO:: Resúmenes de pedidos
  approvedSummary(id: string) {
    return this._http.delete(`${this.url}order-summaries/approved/${id}`);
  }

  downloadItems(order_number: string) {
    const userID = this.user()?.id;
    if (!userID) {
      throw new Error('No se ha podido obtener el ID del usuario');
    }

    return this._http.get(`${this.url}orders-storage_manager/export-items/${userID}/${order_number}`).pipe(
      map((res: any) => res.data)
    );
  }

  suspendend(id: string) {
    return this._http.patch(`${this.url}orders-storage_manager/suspend-received/${id}`, {});
  }

  newSytexMO(id: string) {
    return this._http.post(`${this.url}orders-storage_manager/generate-mo/${id}`, {});
  }
}
