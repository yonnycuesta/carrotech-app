import { computed, inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { RoleEnum, UserStatusEnum } from '../enums/user-enum';
import { AuthService } from '../../home/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly url: string = environment.apiURL;
  private authService = inject(AuthService);

  public user = computed(() => this.authService.currentUser());

  private userStatus: UserStatusEnum[] = [
    UserStatusEnum.active, UserStatusEnum.inactive
  ];

  private userRoles: RoleEnum[] = [
    RoleEnum.admin, RoleEnum.guest, RoleEnum.staff, RoleEnum.storage_manager
  ];

  constructor(private _http: HttpClient) { }

  index(): Observable<any> {
    return this._http.get(`${this.url}users/`).pipe(
      map((res: any) => res.data),
      catchError((err) => {
        console.log('Error al obtener los usuarios: ', err);
        return err;
      })
    );
  }

  store(user: any) {
    return this._http.post(`${this.url}users`, user);
  }

  update(id: string, user: any) {
    return this._http.put(`${this.url}users/${id}`, user);
  }

  delete(id: string) {
    return this._http.delete(`${this.url}users/${id}`);
  }

  getUserRoles() {
    return [...this.userRoles];
  }

  getUserStatus() {
    return [...this.userStatus];
  }


  getProfile(userId: string) {
    return this._http.get(`${this.url}users/profile/${userId}`).pipe(
      catchError((err) => {
        console.log('Error al obtener el perfil del usuario: ', err);
        return err;
      })
    );
  }


  // TODO:: Storage Managers
  indexStorageManagers(): Observable<any> {
    return this._http.get(`${this.url}users/storage_managers/`).pipe(
      map((res: any) => res.data),
      catchError((err) => {
        console.log('Error al obtener los Carro Bodegas: ', err);
        return err;
      })
    );
  }

  // TODO:: Staff
  indexStaff(): Observable<any> {
    return this._http.get(`${this.url}users/staff/`).pipe(
      map((res: any) => res.data),
      catchError((err) => {
        console.log('Error al obtener el técnico: ', err);
        return err;
      })
    );
  }

  // TODO:: Bodega
  indexWarehouses(): Observable<any> {
    return this._http.get(`${this.url}users/warehouses/`).pipe(
      map((res: any) => res.data),
      catchError((err) => {
        console.log('Error al obtener el usuario Bodega: ', err);
        return err;
      })
    );
  }

  indexWarehousesStaff(): Observable<any> {
    return this._http.get(`${this.url}users/warehouse-staff/`).pipe(
      map((res: any) => res.data),
      catchError((err) => {
        console.log('Error al obtener el usuario Bodega Personal: ', err);
        return err;
      })
    );
  }

  adminUser(): Observable<any> {
    return this._http.get(`${this.url}users/admin/admin`).pipe(
      catchError((err) => {
        console.log('Error al obtener el administrador: ', err);
        return err;
      })
    );
  }
}
