import { computed, inject, Inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PdfService } from './pdf.service';
import { concatMap, delay, from, Observable } from 'rxjs';
import { IOrderApproved, IOrderItem } from '../interfaces/warehouse';
import { AuthService } from '../../home/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderWarehouseService {

  private readonly url: string = environment.apiURL + 'orders-warehouses/';
  private readonly url2: string = environment.apiURL + 'orders-cwarehouses/';
  private readonly urlStaff: string = environment.apiURL + 'orders-warehouse-staff/';
  private readonly urlAdmin: string = environment.apiURL + 'orders/';



  private authService = inject(AuthService);

  public user = computed(() => this.authService.currentUser());


  pdfService = inject(PdfService);

  constructor(private _http: HttpClient) { }

  // TODO:: BODEGA
  openends() {
    return this._http.get(`${this.url}openends`);
  }

  openendsWithFilters(start_date: any, end_date: any) {
    return this._http.get(`${this.url}openends?initial_range_date=${start_date}&final_range_date=${end_date}`);
  }

  approveds() {
    return this._http.get(`${this.url}approveds`);
  }
  prepareds() {
    return this._http.get(`${this.url}prepareds`);
  }
  completeds() {
    return this._http.get(`${this.url}completeds`);
  }

  show(id: string): Observable<any> {
    return this._http.get(`${this.url}${id}`);
  }

  completedAll(order_ids: any) {
    return this._http.post(`${this.url}completed-all/`, order_ids);
  }
  expiredAll(order_ids: any) {
    return this._http.post(`${this.url2}expired-all/`, order_ids);
  }

  assignedAll(id: string, order_ids: any) {
    return this._http.post(`${this.url2}asigned-all/${id}`, order_ids);
  }

  indexOpened(manager_id: any): Observable<any> {
    return this._http.get(`${this.url}all-opened/${manager_id}`);
  }


  downloadMultipleOrders(selectedIds: string[]): Observable<any> {
    return from(selectedIds).pipe(
      concatMap(id =>
        this.exportItem(id).pipe(
          concatMap((orderData: any) => {
            return from(Promise.resolve().then(() => {
              return this.pdfService.generateOrderMultiPDF(orderData);
            }));
          }),
          delay(1000)
        )
      )
    );
  }

  exportItem(id: string): Observable<any> {
    return this._http.get(`${this.url}export-items/${id}`);
  }


  // TODO:: ------------------------------------------CARROS BODEGA -------------------------------------------------------------------
  indexCarOpened(manager_id: any): Observable<any> {
    return this._http.get(`${this.url2}all-opened/${manager_id}`);
  }

  indexCarApproved(manager_id: any): Observable<any> {
    return this._http.get(`${this.url2}approveds/${manager_id}`);
  }

  indexCarPrepared(manager_id: any): Observable<any> {
    return this._http.get(`${this.url2}prepareds/${manager_id}`);
  }
  indexCarTransfered(manager_id: any): Observable<any> {
    return this._http.get(`${this.url2}transfereds/${manager_id}`);
  }

  // TODO:: ITEMS
  storeItems(id: string, items: IOrderItem) {
    return this._http.post(`${this.url2}add-item/${id}`, items);
  }

  approvedOrder(id: string, data: IOrderApproved) {
    return this._http.put(`${this.url2}order-approved/${id}`, data);
  }

  approvedAll(order_ids: any) {
    return this._http.post(`${this.url2}approved-all/`, order_ids);
  }
  consolidatedAll(order_ids: any) {
    return this._http.post(`${this.urlAdmin}consolidated-all/`, order_ids);
  }
  preparedAll(order_ids: any) {
    return this._http.post(`${this.url2}prepared-all/`, order_ids);
  }
  transferedAll(order_ids: any) {
    return this._http.post(`${this.url2}transfer-tocar-all/`, order_ids);
  }


  // TODO::SYTEX

  newSytexMO(id: string) {
    return this._http.post(`${this.url2}generate-mo/${id}`, {});
  }


  // TODO:: ----------------BODEGA  PERSONAL-------------------------------
  openendStaff(userId: string) {
    return this._http.get(`${this.urlStaff}openends/${userId}`);
  }

  approvedStaff(userId: string) {
    return this._http.get(`${this.urlStaff}approveds/${userId}}`);
  }
  preparedStaff(userId: string) {
    return this._http.get(`${this.urlStaff}prepareds/${userId}`);
  }
  completedStaff(userId: string) {
    return this._http.get(`${this.urlStaff}completeds/${userId}}`);
  }

}

