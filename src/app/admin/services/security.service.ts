import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private readonly url: string = environment.apiURL;

  constructor(private _http: HttpClient) { }


  accessLogs(): Observable<any> {
    return this._http.get(`${this.url}auth/login-records`);
  }

}
