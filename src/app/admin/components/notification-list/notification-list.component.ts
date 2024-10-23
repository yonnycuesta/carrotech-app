import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Notification, NotificationService } from '../../services/notification.service';
import { AuthService } from '../../../home/services/auth/auth.service';


import Pusher from 'pusher-js';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressBarModule,
  ],
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ]
})
export class NotificationListComponent implements OnInit {
  notifications: Notification[] = [];

  private authService = inject(AuthService);
  public user = computed(() => this.authService.currentUser());

  userId: any = '';

  notificationse: string[] = [];
  pusher: any;

  constructor(
    private readonly notificationService: NotificationService,
    private snackBar: MatSnackBar

  ) {
    this.userId = this.user()?.id;
  }

  ngOnInit(): void {

     // Initialize Pusher
     this.pusher = new Pusher('876f017d6d33a6d34b1b', {
      cluster: 'us2'
    });

    // Subscribe to the channel
    const channel = this.pusher.subscribe('notifications');

    // Bind to the event
    channel.bind('new-notification', (data: any) => {
      this.notificationse.push(data.message);
    });


    this.notificationService.getNotifications(this.userId).subscribe(
      notifications => this.notifications = notifications
    );

    this.notificationService.notifications$.subscribe(
      newNotifications => {
        this.notifications = [...newNotifications, ...this.notifications];
        this.showNewNotificationAlert(newNotifications.length);
      }
    );


  }

  markAsRead(id: any) {
    this.notificationService.markAsRead(id).subscribe(() => {
      this.notifications = this.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      );
      this.snackBar.open('Notificación leída', 'Close', {
        duration: 3000,
      });
    });
  }

  private showNewNotificationAlert(count: number) {
    if (count > 0) {
      this.snackBar.open(`You have ${count} new notification${count > 1 ? 's' : ''}`, 'View', {
        duration: 5000,
      }).onAction().subscribe(() => {
        // window.scrollTo(0, 0);
      });
    }
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'info': return 'info';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'notifications';
    }
  }

  getNotificationColor(type: string): string {
    switch (type) {
      case 'info': return 'primary';
      case 'warning': return 'accent';
      case 'error': return 'warn';
      default: return '';
    }
  }

}
