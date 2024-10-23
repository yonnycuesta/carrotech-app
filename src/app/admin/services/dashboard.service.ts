import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from '../../home/services/auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly url: string = environment.apiURL;
  private authService = inject(AuthService);
  public user = computed(() => this.authService.currentUser());
  public role = computed(() => this.authService.getRole());

  constructor(private _http: HttpClient) { }

  index(): Observable<any> {

    const userId = this.user()?.id;
    switch (this.role()) {
      case 'admin':
        return this._http.get(`${this.url}dashboard/`);
      case 'staff':
        return this._http.get(`${this.url}dashboard/staff/${userId}`);
      case 'storage_manager':
        return this._http.get(`${this.url}dashboard/storage_manager/${userId}`);
      default:
        return this._http.get(`${this.url}dashboard/`);
    }
  }
}
