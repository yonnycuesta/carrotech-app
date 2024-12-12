import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../home/services/auth/auth.service';
import { IOrderSummary } from '../../interfaces/order-interface';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: 'dashboard.component.html',
  styleUrl: 'dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  orderSummaries: IOrderSummary[] = [];

  private authService = inject(AuthService);
  public role = computed(() => this.authService.getRole());

  constructor(
    private readonly sDahsboard: DashboardService,
  ) { }

  ngOnInit() {
    this.sDahsboard.index().subscribe({
      next: (resp: any) => {
        this.getDataCounter(resp);
      },
      error: (err: any) => {
        console.log('Error', err);
      }
    });
  }

  getDataCounter(resp: any) {

    switch (this.role()) {
      case 'storage_manager':
        this.orderSummaries = [
          { status: 'Abiertas/Asignadas', count: resp.openend, icon: 'inbox', color: 'primary' },
          { status: 'Aprobadas', count: resp.approved, icon: 'check_circle', color: 'accent' },
          { status: 'Completadas', count: resp.completed, icon: 'flag', color: 'info' }
        ];
        break;
      case 'staff':
        this.orderSummaries = [
          { status: 'Abiertas', count: resp.openend + resp.inwarehouse, icon: 'inbox', color: 'primary' },
          { status: 'Aprobadas', count: resp.approved, icon: 'check_circle', color: 'accent' },
          { status: 'Preparadas', count: resp.prepared, icon: 'done_all', color: 'info' },
          { status: 'Por confirmar', count: resp.tobe_confirmed, icon: 'hourglass_empty', color: 'accent' },
          { status: 'Canceladas', count: resp.cancelled, icon: 'cancel', color: 'warn' },
          { status: 'Completadas', count: resp.completed, icon: 'flag', color: 'info' }
        ];
        break;
      case 'warehouse_admin':
        this.orderSummaries = [
          { status: 'Abiertas/Asignadas', count: resp.inwarehouse, icon: 'inbox', color: 'primary' },
          { status: 'Aprobadas', count: resp.approved, icon: 'check_circle', color: 'accent' },
          { status: 'Preparadas', count: resp.prepared, icon: 'done_all', color: 'accent' },
          { status: 'Completadas', count: resp.completed, icon: 'flag', color: 'info' }
        ];
        break;
      case 'warehouse_staff':
        this.orderSummaries = [
          { status: 'Abiertas/Asignadas', count: resp.inwarehouse, icon: 'inbox', color: 'primary' },
          { status: 'Aprobadas', count: resp.approved, icon: 'check_circle', color: 'accent' },
          { status: 'Preparadas', count: resp.prepared, icon: 'done_all', color: 'accent' },
          { status: 'Completadas', count: resp.completed, icon: 'flag', color: 'info' }
        ];
        break;
      default:
        this.orderSummaries = [
          { status: 'Abiertas', count: resp.openend, icon: 'inbox', color: 'primary' },
          { status: 'Aprobadas', count: resp.approved, icon: 'check_circle', color: 'accent' },
          { status: 'Canceladas', count: resp.cancelled, icon: 'cancel', color: 'warn' },
          { status: 'Completadas', count: resp.completed, icon: 'flag', color: 'info' }
        ];

    }
  }
}
