import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProgressComponent } from '../../../helpers/progress/progress.component';
import { AuthService } from '../../../../home/services/auth/auth.service';
import { OrderSupervisorService } from '../../../services/order-supervisor.service';
import Swal from 'sweetalert2';
import { OrderStatuComponent } from '../../orders/order-statu/order-statu.component';
import { MatDialog } from '@angular/material/dialog';
import { ApprovedModalComponent } from '../approved-modal/approved-modal.component';

@Component({
  selector: 'app-approved',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatListModule,
    MatTableModule,
    MatTooltipModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    ProgressComponent
  ],
  templateUrl: './approved.component.html',
  styleUrl: './approved.component.scss'
})
export class ApprovedComponent implements OnInit {

  accordion = viewChild.required(MatAccordion);
  orders: any;
  isLoading: boolean = true;

  constructor(
    private readonly sOrder: OrderSupervisorService,
    public dialog: MatDialog,

  ) { }

  ngOnInit(): void {
    this.getAll();
  }


  getAll() {
    try {
      this.sOrder.indexToConfirmed().subscribe({
        next: (response) => {
          this.orders = response;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error.detail
          });
        }
      });
    } catch (error) {
      this.isLoading = false;
      console.error(error);
    }
  }


  updateStatu(order: any) {
    const dialogRef = this.dialog.open(ApprovedModalComponent, {
      data: {
        order_id: order.id
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.data.action != 'Cancelar') {
        this.getAll();
        Swal.fire({
          title: 'Orden actualizada',
          text: 'La orden ha sido actualizada con éxito',
          icon: 'success',
          timer: 2000
        });
      }
    });
  }

}
