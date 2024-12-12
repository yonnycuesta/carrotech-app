import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProgressComponent } from '../../../../helpers/progress/progress.component';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../../home/services/auth/auth.service';
import { OrderStaffService } from '../../../../services/order-staff.service';

@Component({
  selector: 'app-order-list-prepared',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatTableModule,
    MatTooltipModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    ProgressComponent
  ],
  templateUrl: './order-list-prepared.component.html',
  styleUrl: './order-list-prepared.component.scss'
})
export class OrderListPreparedComponent implements OnInit {

  accordion = viewChild.required(MatAccordion);
  authService = inject(AuthService);
  orders: any;

  userId: any = '';
  private _route = inject(ActivatedRoute);
  isLoading: boolean = true;


  constructor(private readonly _sOrder: OrderStaffService
  ) {
  }

  ngOnInit(): void {
    this._route.params.subscribe({
      next: (params) => {
        this.userId = params['id'];
        this.getOrders();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getOrders() {
    try {
      this._sOrder.indexPrepared(this.userId).subscribe({
        next: (resp) => {
          this.orders = resp;
          this.isLoading = false;
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
          Swal.fire({
            title: 'Sin ordenes',
            text: err.error.detail + ' preparadas en este momento.',
            icon: 'info',
            confirmButtonText: "Entendido"
          });
        }
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: 'Error al obtener las ordenes',
        icon: 'error',
        timer: 4000
      });
    }
  }

}
