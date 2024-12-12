import { AsyncPipe, CommonModule, Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, of, startWith, Subscription, switchMap, timeout } from 'rxjs';
import { IItem, IOrderItem } from '../../../interfaces/order-interface';
import { OrderStaffService } from '../../../services/order-staff.service';
import { AlertService } from '../../../services/alert.service';
import { MaterialService } from '../../../services/material.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-order-item-form',
  standalone: true,
  imports: [
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
  templateUrl: './order-item-form.component.html',
  styleUrl: './order-item-form.component.scss'
})
export class OrderItemFormComponent implements OnInit, OnDestroy {

  itemForm: FormGroup;
  private itemsSubject = new BehaviorSubject<IItem[]>([]);
  items$: Observable<IItem[]> = this.itemsSubject.asObservable();
  private subscription: Subscription = new Subscription();

  order_num: string = "";
  orderID: string = "";

  optionMaterials!: Observable<any[]>;
  materials: any[] = [];

  constructor(
    private fb: FormBuilder,
    private _route: ActivatedRoute,
    private readonly sOrder: OrderStaffService,
    private readonly alertService: AlertService,
    private readonly _router: Router,
    private readonly _location: Location,
    private readonly _sMaterial: MaterialService


  ) {
    this.itemForm = this.fb.group({
      item_name: ['', Validators.required],
      item_code: ['', [Validators.required]],
      item_qty: ['', [Validators.required, Validators.min(1)]],
      item_unit: ['und']
    });
  }

  ngOnInit() {
    this.subscription = this.items$.subscribe();
    this._route.params.subscribe(params => {
      this.order_num = params['norder'];
      this.orderID = params['id'];
    }, timeout(2000));

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

  saveItems() {

    const options = {
      title: 'Guardar Items',
      message: `¿Estás seguro de guardar los items?`,
      cancelText: 'NO',
      confirmText: 'SI',
    };

    this.alertService.open(options);
    this.alertService.confirmed().subscribe(confirmed => {
      if (confirmed) {

        const data: IOrderItem = {
          order_id: this.orderID,
          items: this.itemsSubject.value
        }

        this.sOrder.storeItems(this.orderID, data).subscribe({
          next: (resp) => {
            Swal.fire('Componentes Agregados correctamente', '', 'success');
            this. goBack();
            this.itemsSubject.next([]);
            this.itemForm.reset();
          },
          error: (err) => {
            console.log('Error: ', err);
          }
        });

      }
    });
  }

  cancel() {
    this.itemsSubject.next([]);
    this.itemForm.reset();
  }

  goBack() {
    this._location.back();
  }

}
