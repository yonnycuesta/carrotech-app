import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AvailabilityService {

  private readonly url: string = environment.apiURL;

  constructor(private http: HttpClient) { }

  getAvailability(): Observable<any> {
    return this.http.get(`${this.url}availables`).pipe(
      map((response: any) => {
        return response[0];
      }),
    );
  }

  storage(data: any): Observable<any> {
    return this.http.post(`${this.url}availables`, data);
  }
}
