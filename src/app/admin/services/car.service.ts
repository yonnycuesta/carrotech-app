import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ICarCreate } from '../interfaces/car-interfaces';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  private readonly url: string = environment.apiURL;

  constructor(private _http: HttpClient) { }

  index(): Observable<any>{
    return this._http.get(`${this.url}cars/`).pipe(
      map((res: any) => res.data),
      catchError((err) => {
        console.log('Error al obtener los carros: ', err);
        return err;
      })
    );
  }

  store(data: ICarCreate) {
    return this._http.post(`${this.url}cars/`, data).pipe(
      catchError(err => {
        return throwError(err);
      })
    );
  }

  show(id: string) {
    return this._http.get(`${this.url}cars/${id}`);
  }

  update(id: string, data: ICarCreate) {
    return this._http.patch(`${this.url}cars/${id}`, data).pipe(
      catchError(err => {
        return throwError(err);
      })
    );
  }

  destroy(id: string) {
    return this._http.delete(`${this.url}cars/${id}`).pipe(
      catchError(err => {
        return throwError(err);
      })
    );
  }
}
