import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from '../../home/services/auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private readonly url: string = environment.apiURL;
  private authService = inject(AuthService);
  public user = computed(() => this.authService.currentUser());

  constructor(private _http: HttpClient) { }


  index(): Observable<any> {
    return this._http.get(`${this.url}orders/`);
  }
  getStatus() {
    const userID = this.user()?.id;
    return this._http.get(`${this.url}orders-status/status/${userID}`);
  }

  delete(id: string): Observable<any> {
    return this._http.delete(`${this.url}orders/${id}`);
  }



  // TODO:: ESTADOS


  indexStatus() {
    return this._http.get(`${this.url}orders-status/`);
  }

  storeStatus(data: any) {
    return this._http.post(`${this.url}orders-status/`, data);
  }

  updateStatus(id: string, data: any) {
    return this._http.put(`${this.url}orders-status/${id}`, data);
  }

  showStatus(id: string) {
    return this._http.get(`${this.url}orders-status/${id}`);
  }

  deleteStatus(id: string) {
    return this._http.delete(`${this.url}orders-status/${id}`);
  }
}
