import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IMaterialStore } from '../interfaces/material-interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private readonly url: string = environment.apiURL;

  constructor(private _http: HttpClient) { }


  index(): Observable<any> {
    return this._http.get(`${this.url}materials/options`);
  }

  all(): Observable<any> {
    return this._http.get(`${this.url}materials/`);
  }

  store(data: IMaterialStore) {
    return this._http.post(`${this.url}materials/`, data);
  }

  update(data: IMaterialStore, id: string) {
    return this._http.patch(`${this.url}materials/${id}`, data);
  }

  show(id: string){
    return this._http.get(`${this.url}materials/${id}`);
  }

  delete(id: string){
    return this._http.delete(`${this.url}materials/${id}`);
  }

  storeImport(data: any) {
    return this._http.post(`${this.url}materials/import-from-excel/`, data);
  }

}
