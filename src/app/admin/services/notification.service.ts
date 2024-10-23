import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';


export interface Notification {
  id: string;
  user_id: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private readonly apiUrl: string = environment.apiURL;


  constructor(private _http: HttpClient) {
  }

  getNotifications(userId: string): Observable<Notification[]> {
    return this._http.get<Notification[]>(`${this.apiUrl}notifications/${userId}`);
  }

  getNotificationsUnread(userId: string): Observable<Notification[]> {
    return this._http.get<Notification[]>(`${this.apiUrl}notifications/unread/${userId}`);
  }

  createNotification(notification: Omit<Notification, 'id' | 'read' | 'created_at'>): Observable<Notification> {
    return this._http.post<Notification>(`${this.apiUrl}notifications/`, notification);
  }

  markAsRead(notificationId: string): Observable<any> {
    return this._http.put(`${this.apiUrl}notifications/${notificationId}/read`, {});
  }

  get notifications$(): Observable<Notification[]> {
    return this.notificationsSubject.asObservable();
  }

}
