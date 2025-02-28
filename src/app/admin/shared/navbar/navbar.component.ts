import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatMenu, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatSupportComponent } from '../../components/chat-support/chat-support.component';
import { NotificationService } from '../../services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../home/services/auth/auth.service';
import Pusher from 'pusher-js';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { logueB64 } from '../../helpers/form-validator';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ReactiveFormsModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    RouterModule,
    MatMenu,
    MatMenuModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatExpansionModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  notificationse: string[] = [];

  _router = inject(Router);
  authService = inject(AuthService);
  public role = computed(() => this.authService.getRole());
  public user = computed(() => this.authService.currentUser());

  logue: any = logueB64.data;

  userId: any;
  showFiller = false;
  pusher: any;

  notiQty: any;

  today: number = Date.now();


  constructor(
    private readonly _sAuth: AuthService,
    private readonly notificationService: NotificationService,
    public dialog: MatDialog,

  ) {
    this.userId = this.user()?.id;
  }

  ngOnInit() {
    this.pusher = new Pusher('876f017d6d33a6d34b1b', {
      cluster: 'us2'
    });

    const channel = this.pusher.subscribe('notifications');

    channel.bind('new-notification', (data: any) => {
      this.notificationse.push(data.message);
      this.notiQty = this.notificationse.length > 0 ? this.notificationse.length : 0;
    });
  }


  openOrderView() {
    switch (this.role()) {
      case 'admin':
        this._router.navigate(['/order_admin']);
        break;
      case 'staff':
        this._router.navigate(['/order_staff']);
        break;
      case 'storage_manager':
        this._router.navigate(['/order_manager']);
        break;
    }

  }


  logout() {
    this._sAuth.logout();
    this._router.navigate(['/login']);
  }

  openChatSupport(): void {
    const dialogRef = this.dialog.open(ChatSupportComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {

      }
    });
  }
}
