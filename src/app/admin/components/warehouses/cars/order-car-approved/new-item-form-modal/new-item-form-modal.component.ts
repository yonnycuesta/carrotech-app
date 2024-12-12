import { Component, computed, inject, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatLabel, MatError, MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BehaviorSubject, Observable, of, startWith, Subscription, switchMap } from 'rxjs';
import { IItem } from '../../../../../interfaces/order-interface';
import { OrderStaffService } from '../../../../../services/order-staff.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../../services/alert.service';
import { MaterialService } from '../../../../../services/material.service';
import { CommonModule, AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import Swal from 'sweetalert2';
import { OrderWarehouseService } from '../../../../../services/order-warehouse.service';
import { IOrderItem } from '../../../../../interfaces/warehouse';
import { AuthService } from '../../../../../../home/services/auth/auth.service';

@Component({
  selector: 'app-new-item-form-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatSelectModule,
  ],
  templateUrl: './new-item-form-modal.component.html',
  styleUrl: './new-item-form-modal.component.scss'
})
export class NewItemFormModalComponent implements OnInit {

  itemForm!: FormGroup;
  private itemsSubject = new BehaviorSubject<IItem[]>([]);
  items$: Observable<IItem[]> = this.itemsSubject.asObservable();
  private subscription: Subscription = new Subscription();

  order_num: string = "";
  orderID: string = "";

  optionMaterials!: Observable<any[]>;
  materials: any[] = [];

  authService = inject(AuthService);
  public user = computed(() => this.authService.currentUser());
  userId: string | undefined = '';

  constructor(
    public dialogRef: MatDialogRef<NewItemFormModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _route: ActivatedRoute,
    private readonly sOrder: OrderWarehouseService,
    private readonly alertService: AlertService,
    private readonly _router: Router,
    private readonly _sMaterial: MaterialService
  ) {
    this.itemForm = this.fb.group({
      item_name: ['', Validators.required],
      item_code: ['', [Validators.required]],
      item_qty: ['', [Validators.required, Validators.min(1)]],
      item_unit: ['und']
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.orderID = this.data.id;
    }

    this.userId = this.user()?.id;

    this.getMaterials();

    this.optionMaterials = this.itemForm.get('item_name')!.valueChanges.pipe(
      startWith(''),
      switchMap(value => this._filter(value || ''))
    );
  }


  private _filter(value: string): Observable<any[]> {

    if (typeof value !== 'string' || value === '') {
      return of([]);
    }

    const filterValue = value.toLowerCase();
    return of(this.materials.filter((option: any) =>
      option.name.toLowerCase().includes(filterValue) ||
      option.code.toLowerCase().includes(filterValue)
    ));
  }

  getMaterials() {
    this._sMaterial.index().subscribe({
      next: (res: any) => {
        this.materials = res;
      },
      error: (err) => {
        console.error('Error al cargar materiales:', err);
        this.materials = [];
      }
    });
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onOptionSelected(event: any) {
    const selectedMaterial = event.option.value;
    this.itemForm.patchValue({
      item_name: selectedMaterial.name,
      item_code: selectedMaterial.code
    });
  }

  addItem() {
    if (this.itemForm.valid) {
      if (this.itemForm.valid) {
        const currentItems = this.itemsSubject.value;
        const index = currentItems.findIndex(item => item.item_name === this.itemForm.value.item_name);
        if (index > -1) {
          const item = currentItems[index];
          item.item_qty += this.itemForm.value.item_qty;
          currentItems[index] = item;
        } else {
          this.itemsSubject.next([...currentItems, this.itemForm.value]);
        }
        this.itemForm.reset();
      }
    }
  }

  removeItem(index: number) {
    const currentItems = this.itemsSubject.value;
    this.itemsSubject.next(currentItems.filter((_, i) => i !== index));
  }

  closeDialog() {
    this.dialogRef.close({ data: { action: 'Cancelar' } });
  }

  cancel() {
    this.itemsSubject.next([]);
    this.itemForm.reset();
  }


  onSubmit() {
    const data: IOrderItem = {
      order_id: this.orderID,
      user_id: this.userId,
      items: this.itemsSubject.value
    }
    this.sOrder.storeItems(this.orderID, data).subscribe({
      next: (resp) => {
        Swal.fire('Componentes Agregados correctamente', '', 'success');
        this.itemsSubject.next([]);
        this.itemForm.reset();
        this.dialogRef.close({ data: { action: 'Add' } });
      },
      error: (err) => {
        console.log('Error: ', err);
      }
    });

  }
}
