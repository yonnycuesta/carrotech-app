import { AsyncPipe, CommonModule, Location } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { BehaviorSubject, map, Observable, of, startWith, Subscription, switchMap } from 'rxjs';
import { IItem, IOrdercCreate } from '../../../interfaces/order-interface';
import { OrderStaffService } from '../../../services/order-staff.service';
import { Router, RouterModule } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { UserService } from '../../../services/user.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../home/services/auth/auth.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MaterialService } from '../../../services/material.service';
import { MatList, MatListItem, MatListModule, MatListOption } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepicker, MatDatepickerModule, MatDateRangePicker } from '@angular/material/datepicker';
import { HelperService } from '../../../services/helper.service';
@Component({
  selector: 'app-order-create',
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
    MatSelectModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatListModule,
    MatExpansionModule,
    RouterModule,
    MatIcon,
    MatDatepickerModule
  ],
  templateUrl: './order-create.component.html',
  styleUrl: './order-create.component.scss'
})
export class OrderCreateComponent implements OnInit, OnDestroy {

  private _snackBar = inject(MatSnackBar);
  private hService = inject(HelperService);

  durationInSeconds = 5;

  itemForm!: FormGroup;
  private itemsSubject = new BehaviorSubject<IItem[]>([]);
  items$: Observable<IItem[]> = this.itemsSubject.asObservable();
  private subscription: Subscription = new Subscription();
  storageManagers: any;

  authService = inject(AuthService);
  public user = computed(() => this.authService.currentUser());

  storage_manager_id: string = "";
  delivered_opt: string = "";
  comment: string = "";
  zone: string = "";
  userId: any = "";
  optionMaterials!: Observable<any[]>;
  materials: any[] = [];
  panelOpenState = true;

  delivered_site = 1;
  warehouses: any;


  isAvailable: boolean = false;

  constructor(
    private fb: FormBuilder,
    private readonly sOrder: OrderStaffService,
    private readonly alertService: AlertService,
    private readonly _router: Router,
    private readonly _userService: UserService,
    private readonly _location: Location,
    private readonly _sMaterial: MaterialService

  ) {
    this.itemForm = this.fb.group({
      item_name: ['', [Validators.required]],
      item_code: ['', [Validators.required]],
      item_qty: ['', [Validators.required, Validators.min(1)]],
      item_unit: ['und'],
    });
    this.userId = this.user()?.id;
  }

  ngOnInit(): void {

    this.subscription = this.items$.subscribe();

    this.getStorageManagers();
    this.getMaterials();
    this.getWarehouses();

    this.optionMaterials = this.itemForm.get('item_name')!.valueChanges.pipe(
      startWith(''),
      switchMap(value => this._filter(value || ''))
    );

    this.hService.checkAvailability().subscribe((isAvailable) => {
      this.isAvailable = isAvailable;
    });


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


  getStorageManagers() {
    this._userService.indexStorageManagers().subscribe({
      next: (resp) => {
        this.storageManagers = resp;
      },
      error: (err) => {
        console.log('Error: ', err);
      }
    });
  }

  getWarehouses() {
    this._userService.indexWarehouses().subscribe({
      next: (resp) => {
        this.warehouses = resp;
      },
      error: (err) => {
        console.log('Error: ', err);
      }
    });
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
      this.showSnackBar('Componente agregado');
    }
  }

  removeItem(index: number) {
    const currentItems = this.itemsSubject.value;
    this.itemsSubject.next(currentItems.filter((_, i) => i !== index));
    this.showSnackBar('Componente eliminado');
  }

  saveItems() {

    if (this.zone == '' || this.zone == null) {
      this.showSnackBar('Seleccione una zona');
      return;
    }

    if (this.itemsSubject.value.length <= 0) {
      this.showSnackBar('No hay componentes para guardar');
      return;
    }

    Swal.fire({
      title: 'CREAR ORDEN',
      text: '¿Desea crear esta Nueva Orden de Materiales/Equipos?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#117554',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, crear',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {

        Swal.fire({
          title: 'Creando su orden...',
          text: 'Por favor espere...',
          icon: 'info',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const data: IOrdercCreate = {
          user_id: this.userId,
          comment: this.comment,
          zone: this.zone,
          delivered_opt: "Sytex",
          details: this.itemsSubject.value
        }

        this.sOrder.storeOrder(data).subscribe({
          next: (resp) => {
            Swal.close();
            Swal.fire({
              title: 'Orden creada',
              text: 'Su orden ha sido creada exitosamente, por favor verifique el estado de la orden en unos minutos.',
              icon: 'success',
              confirmButtonText: 'Entendido',
            });
            this.goBack();
            this.itemsSubject.next([]);
            this.itemForm.reset();
          },
          error: (err) => {
            Swal.close();
            console.log('Error: ', err);
            Swal.fire({
              title: 'Error',
              text: 'Ha ocurrido un error al crear la orden, contacte al administrador o supervisor.',
              icon: 'error',
            });
          }
        });
      } else {
        Swal.fire({
          title: 'Cancelado',
          text: 'No se ha creado la orden',
          timer: 2000,
        })
      }
    });
  }
  cancel() {
    this.itemsSubject.next([]);
    this.itemForm.reset();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  validStorageManager() {
    if (this.storage_manager_id == '') {
      Swal.fire('Selecciona un Carro Bodega', '', 'warning');
    }

    if (this.delivered_opt == '') {
      Swal.fire('Selecciona una opción de entrega', '', 'warning');
    }
  }

  goBack() {
    this._location.back();
  }

  showSnackBar(message: string) {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
