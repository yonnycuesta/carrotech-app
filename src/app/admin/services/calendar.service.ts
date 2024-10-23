import { computed, inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../home/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private readonly url: string = environment.apiURL;
  private authService = inject(AuthService);
  public user = computed(() => this.authService.currentUser());
  public role = computed(() => this.authService.getRole());

  constructor(private _http: HttpClient) { }

  index() {
    const userId = this.user()?.id;
    switch (this.role()) {
      case 'admin':
        return this._http.get(`${this.url}calendars/`);
      case 'staff':
        return this._http.get(`${this.url}calendars/staff/${userId}`);
      case 'storage_manager':
        return this._http.get(`${this.url}calendars/manager/${userId}`);
      default:
        return this._http.get(`${this.url}calendars/`);
    }
  }
}
