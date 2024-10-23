import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, inject, OnInit, viewChild, ViewChild, ViewContainerRef } from '@angular/core';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { provideNativeDateAdapter } from '@angular/material/core';
import { OrderStaffService } from '../../../services/order-staff.service';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../home/services/auth/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NgToastModule, NgToastService, ToasterPosition } from 'ng-angular-popup';
import { OrderItemEditComponent } from '../order-item-edit/order-item-edit.component';
import Swal from 'sweetalert2';
import { AlertService } from '../../../services/alert.service';
import { OrderStatuComponent } from '../../../components/orders/order-statu/order-statu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-order-list',
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
    MatDialogModule,
    NgToastModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListComponent implements OnInit {

  accordion = viewChild.required(MatAccordion);
  authService = inject(AuthService);
  orders: any;
  public user = computed(() => this.authService.currentUser());
  toast = inject(NgToastService);
  ToasterPosition = ToasterPosition;

  add: string = 'Agregar';
  edit: string = 'Editar';
  delete: string = 'Eliminar';
  userId: any = '';


  constructor(private readonly _sOrder: OrderStaffService,
    public dialog: MatDialog,
    private alertService: AlertService,
  ) {
    this.userId = this.user()?.id;
  }

  ngOnInit(): void {
    this.getOrders();
  }


  getOrders() {
    this._sOrder.index(this.userId).subscribe({
      next: (resp) => {
        this.orders = resp;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  editItem(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(OrderItemEditComponent, {
      width: '500px',
      data: obj,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const action = result.data['action'];
        if (action == 'Actualizar') {
          Swal.fire('Componente actualizado correctamente', '', 'success');
          this.getOrders();
        }
      }
    });
  }

  removeItem(id: string) {
    const options = {
      title: 'Eliminar Componente',
      message: `¿Estás seguro de eliminar el item?`,
      cancelText: 'NO',
      confirmText: 'SI',
    };

    this.alertService.open(options);

    this.alertService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this._sOrder.deleteItem(id).subscribe({
          next: (resp) => {
            Swal.fire('Componente eliminado correctamente', '', 'success');
            this.getOrders();
          },
          error: (err) => {
            console.log('Error: ', err);
          }
        });
      }
    });

  }


  cancel(order: any){
    const dialogRef = this.dialog.open(OrderStatuComponent, {
      data: {
        order_id: order.id,
        statu: order.statu
      },
    });
    dialogRef.afterClosed().subscribe((result) => {

    });
  }
}
