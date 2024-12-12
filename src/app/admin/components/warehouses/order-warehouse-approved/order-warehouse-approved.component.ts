import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgToastModule, NgToastService, ToasterPosition } from 'ng-angular-popup';
import { BehaviorSubject, Observable, Subscription, timeout } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../home/services/auth/auth.service';
import { OrderStoragaManagerService } from '../../../services/order-manager.service';
import { OrderWarehouseService } from '../../../services/order-warehouse.service';
import { NewItemFormModalComponent } from '../cars/order-car-approved/new-item-form-modal/new-item-form-modal.component';
import { IOrderApproved } from '../../../interfaces/warehouse';

@Component({
  selector: 'app-order-warehouse-approved',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatListModule,
    RouterModule,
    MatExpansionModule,
  ],
  templateUrl: './order-warehouse-approved.component.html',
  styleUrl: './order-warehouse-approved.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderWarehouseApprovedComponent implements OnInit, OnDestroy, AfterViewInit {

  ToasterPosition = ToasterPosition;
  toast = inject(NgToastService);
  readonly panelOpenState = signal(false);
  readonly panelRejectedOpenState = signal(false);

  displayedColumns: string[] = ['item_name', 'item_code', 'item_qty', 'item_unit', 'action'];
  displayedRejectedColumns: string[] = ['item_name', 'item_qty', 'qty_delivered', 'action'];

  itemForm: FormGroup;
  private itemsSubject = new BehaviorSubject<any[]>([]);
  items$: Observable<any[]> = this.itemsSubject.asObservable();
  private subscription: Subscription = new Subscription();

  orderOne: any = {};
  orderID: string = '';
  comment: string = '';
  delivery_time!: Date;
  storage_manager_id: string = '';

  authService = inject(AuthService);
  public user = computed(() => this.authService.currentUser());
  userId: string | undefined = '';


  constructor(
    private sOrder: OrderStoragaManagerService,
    private swOrder: OrderWarehouseService,
    private _route: ActivatedRoute,
    private fb: FormBuilder,
    public dialog: MatDialog,

  ) {
    this.itemForm = this.fb.group({
      item_id: [''],
      item_name: ['', Validators.required],
      qty_requested: ['', [Validators.required, Validators.min(1)]],
      qty_delivered: ['', [Validators.required]],
      qty_pending: [0]
    });
  }

  ngOnInit() {
    this.subscription = this.items$.subscribe();
    this._route.params.subscribe(params => {
      this.orderID = params['id'];
    }, timeout(2000))

    this.getOrder();

    this.userId = this.user()?.id;

    // this.showInfoSwal();

  }

  showInfoSwal() {
    Swal.fire({
      title: 'Sección para aprobar la orden',
      text: 'El botón "Añadir ítem" se utilizará en caso de que no tengas stock de un material o equipo específico. Deberás rechazar el material o equipo y luego añadir el reemplazo. El botón con el icono de "x" se usa para rechazar la cantidad solicitada y establecer la cantidad disponible.',
      icon: 'info',
      confirmButtonText: 'Entendido'
    });
  }
  goBack() {
    window.history.back();
  }
  ngAfterViewInit() {
    this.items$.subscribe();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getOrder() {

    this.swOrder.show(this.orderID).subscribe({
      next: (resp: any) => {
        this.orderOne = resp;
        console.log('Order', resp);
        // this.storage_manager_id = this.orderOne.storage_manager_id;
      },
      error: (err: any) => {
        console.log('Error', err);
      }
    });

  }


  // TODO:: Procesar

  approvedItem() {
    // if (this.itemForm.value.qty_delivered > this.itemForm.value.qty_requested) {
    //   this.toast.danger('La cantidad aprobada no puede ser mayor a la cantidad solicitada', 'Error');
    //   return;
    // }

    const qty_pending = this.itemForm.value.qty_requested - this.itemForm.value.qty_delivered;
    this.itemForm.patchValue({
      qty_pending: qty_pending
    });

    if (this.itemForm.valid) {
      const currentItems = this.itemsSubject.value;
      this.itemsSubject.next([...currentItems, this.itemForm.value]);
      this.itemForm.reset();
    }

  }

  rejectItem(item: any) {

    const currentItems = this.itemsSubject.value;
    const itemExist = currentItems.find((i: any) => i.id === item.id);

    if (itemExist) {
      this.toast.warning('El item ya ha sido rechazado', 'Advertencia');
      return;
    }

    this.itemForm.patchValue({
      item_id: item.id,
      item_name: item.item_name,
      qty_requested: item.item_qty,
    });

  }

  removeItem(index: number) {
    const currentItems = this.itemsSubject.value;
    this.itemsSubject.next(currentItems.filter((_, i) => i !== index));
  }


  saveApproved() {

    const data: IOrderApproved = {
      comment: this.comment,
      order_id: this.orderID,
      user_id: this.userId,
      summaries: this.itemsSubject.value
    }


    Swal.fire({
      title: 'Aprobar orden',
      text: '¿Estás seguro de aprobar la orden?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, aprobar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.swOrder.approvedOrder(this.orderID, data).subscribe({
          next: (resp: any) => {
            Swal.fire({
              title: 'Orden aprobada',
              text: resp.message,
              icon: 'success',
              showConfirmButton: false,
              timer: 3000
            })
            this.goBack();
          },
          error: (err: any) => {
            console.log('Error', err);

            Swal.fire({
              title: 'Error',
              text: err.error.detail,
              icon: 'error',
            });
            this.toast.danger('Error al aprobar la orden', 'Error');
          }
        });
      }
    })
  }


  approveItem(item: any) {
    Swal.fire({
      title: 'APROBAR COMPONENTE',
      text: '¿Estás seguro de aprobar el componente: ' + item.item_name + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, aprobar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sOrder.approvedSummary(item.id).subscribe({
          next: (resp: any) => {
            Swal.fire({
              title: 'Componente aprobado',
              text: resp.msg,
              icon: 'success',
              showConfirmButton: false,
              timer: 3000
            })
            this.getOrder();
          },
          error: (err) => {
            console.log('Error', err);
            this.toast.danger('Error al aprobar el item', 'Error');
          }
        });
      }
    })
  }


  // TODO:: Añadir nuevo Item

  openNewItemModal(id: string) {
    const dialogRef = this.dialog.open(NewItemFormModalComponent, {
      width: '550px',
      data: {
        id: id,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const action = result.data['action'];
        delete result.data['action'];

        if (action == "Add") {
          this.ngOnInit();
        }
      }
    });

  }

}
