import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderSupervisorService {

  private readonly url: string = environment.apiURL;

  constructor(private _http: HttpClient) { }
  indexToConfirmed(): Observable<any> {
    return this._http.get(`${this.url}orders-supervisor/all-toconfirmed`);
  }

  indexRejected(): Observable<any> {
    return this._http.get(`${this.url}orders-supervisor/all-rejected`);
  }

  updateStatus(id: string, data: any){
    return this._http.put(`${this.url}orders-supervisor/statu-change/${id}`, data);
  }
  
}
