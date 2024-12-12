import { computed, Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { AuthStatus, ICheckTokenResponse, ILoginResponse, User } from '../../interfaces/auth';
import { BehaviorSubject, catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly url: string = environment.apiURL;
  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);
  private _authRole = signal<string>('');
  // Exponer al mundo exterior
  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());
  public authRole = computed(() => this._authRole());


  constructor(
    private _http: HttpClient
  ) {

    // this.checkAuthStatus().subscribe();

  }

  register(data: any) {
    return this._http.post(`${this.url}users`, data);
  }

  login(data: any): Observable<boolean> {
    const url = `${this.url}auth/login`;
    return this._http.post<ILoginResponse>(url, data).pipe(
      tap(({ user, token }) => {
        this._currentUser.set(user);
        // this._authStatus.set(AuthStatus.authenticated);
        localStorage.setItem('token', token);
      }),
      map(() => true),
      catchError((err) => {
        return throwError(() => err.error.message);
      }),
    );
  }

  checkAuthStatus(): Observable<boolean> {
    const url = `${this.url}auth/verify-token`;
    const token = localStorage.getItem('token');
    if (!token) return of(false);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._http.get<ICheckTokenResponse>(url, { headers }).pipe(
      map(({ token, user }) => {
        this._currentUser.set(user);
        // this._authStatus.set(AuthStatus.authenticated);
        localStorage.setItem('token', token);
        return true;
      }),
      catchError((err) => {
        // this._authStatus.set(AuthStatus.notAuthenticated);
        return of(false);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    // this._authStatus.set(AuthStatus.notAuthenticated);
  }

  getRole(): string | undefined {
    const user = this._currentUser();
    if (user) {
      return user.role;
    }
    return this._authRole();
  }
  passworRecovery(data: any) {
    return this._http.post(`${this.url}users/password-recovery`, data);
  }

}
