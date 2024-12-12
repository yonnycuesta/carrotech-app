import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgToastModule, NgToastService, ToasterPosition } from 'ng-angular-popup';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../../home/services/auth/auth.service';
import { OrderStatuComponent } from '../../../../components/orders/order-statu/order-statu.component';
import { AlertService } from '../../../../services/alert.service';
import { OrderStaffService } from '../../../../services/order-staff.service';
import { OrderItemEditComponent } from '../../order-item-edit/order-item-edit.component';
import { ProgressComponent } from '../../../../helpers/progress/progress.component';

@Component({
  selector: 'app-order-list-openend',
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
    ProgressComponent
  ],
  templateUrl: './order-list-openend.component.html',
  styleUrl: './order-list-openend.component.scss',
})
export class OrderListOpenendComponent implements OnInit {

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
  private _route = inject(ActivatedRoute);
  isLoading: boolean = true;


  constructor(private readonly _sOrder: OrderStaffService,
    public dialog: MatDialog,
    private alertService: AlertService,
  ) {
    this.userId = this.user()?.id;
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
      this._sOrder.indexOpened(this.userId).subscribe({
        next: (resp) => {
          this.orders = resp;
          this.isLoading = false;
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
          Swal.fire({
            title: 'Sin ordenes',
            text: err.error.detail + ' abiertas en este momento.',
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
    Swal.fire({
      title: 'Eliminar Componente',
      text: '¿Estás seguro de eliminar el componente?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#117554',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this._sOrder.deleteItem(id).subscribe({
          next: (resp: any) => {
            Swal.fire({
              title: 'Componente eliminado',
              text: resp.message,
              icon: 'success',
              timer: 2000
            });
            this.getOrders();
          },
          error: (err) => {
            Swal.fire({
              title: 'Error al eliminar el componente',
              text: err.error.message,
              icon: 'error',
            });
            console.log('Error: ', err);
          }
        });
      }
    });
  }

  cancel(order: any) {
    const dialogRef = this.dialog.open(OrderStatuComponent, {
      data: {
        order_id: order.id,
        statu: order.statu
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      const action = result.data.action;
      if (action == 'Cancelar') {
        Swal.fire({
          title: 'Acción cancelada',
          text: 'La ación ha sido cancelada exitosamente',
          timer: 2000
        });
      } else {
        Swal.fire({
          title: 'Acción realizada',
          text: 'La orden ha sido cancelada exitosamente',
          timer: 2000
        });
      }
    });
  }

}
