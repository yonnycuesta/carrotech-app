import { CommonModule, Location } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { OrderStoragaManagerService } from '../../../services/order-manager.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, timeout } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgToastModule, NgToastService, ToasterPosition } from 'ng-angular-popup';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DateTimePickerModalComponent } from '../date-time-picker-modal/date-time-picker-modal.component';
import { IOrderApproved } from '../../../interfaces/order-manager.interface';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-order-schedule',
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
    NgToastModule,
  ],
  templateUrl: './order-schedule.component.html',
  styleUrl: './order-schedule.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderScheduleComponent implements OnInit, OnDestroy, AfterViewInit {

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

  constructor(
    private sOrder: OrderStoragaManagerService,
    private _route: ActivatedRoute,
    private _router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private readonly _location: Location

  ) {
    this.itemForm = this.fb.group({
      item_id: [''],
      item_name: ['', Validators.required],
      qty_requested: ['', [Validators.required, Validators.min(1)]],
      qty_delivered: ['', [Validators.required]],
      qty_pending: [0]
      // item_unit: ['und', Validators.required]
    });
  }

  ngOnInit() {
    this.subscription = this.items$.subscribe();
    this._route.params.subscribe(params => {
      this.orderID = params['id'];
    }, timeout(2000))

    this.getOrder();
  }

  goBack() {
    this._location.back();
  }
  ngAfterViewInit() {
    this.items$.subscribe();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getOrder() {
    this.sOrder.getOrder(this.orderID).subscribe({
      next: (resp: any) => {
        this.orderOne = resp;
        this.storage_manager_id = this.orderOne.storage_manager_id;
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

  openDateTimePicker(): void {
    const dialogRef = this.dialog.open(DateTimePickerModalComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.delivery_time = result;
        if (this.delivery_time) {
          this.saveApproved();
        } else {
          this.toast.danger('Por favor, seleccione una fecha y hora de entrega', 'Error');
        }
      }
    });
  }



  saveApproved() {

    const data: IOrderApproved = {
      comment: this.comment,
      storage_manager_id: this.storage_manager_id,
      order_id: this.orderID,
      delivery_time: this.delivery_time,
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
        this.sOrder.approvedOrder(this.orderID, data).subscribe({
          next: (resp: any) => {
            Swal.fire({
              title: 'Orden aprobada',
              text: resp.message,
              icon: 'success',
              showConfirmButton: false,
              timer: 3000
            })
            this._router.navigateByUrl('/order_manager');
          },
          error: (err: any) => {
            console.log('Error', err);

            Swal.fire({
              title: 'Error',
              text:  err.error.detail,
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
}
