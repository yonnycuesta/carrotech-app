import { CommonModule, AsyncPipe } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, startWith, switchMap, of } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../../home/services/auth/auth.service';
import { IItem, IOrdercCreate } from '../../../../interfaces/order-interface';
import { AlertService } from '../../../../services/alert.service';
import { MaterialService } from '../../../../services/material.service';
import { OrderStaffService } from '../../../../services/order-staff.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-order-form-edit',
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
    MatExpansionModule
  ],
  templateUrl: './order-form-edit.component.html',
  styleUrl: './order-form-edit.component.scss'
})
export class OrderFormEditComponent implements OnInit {

  itemForm!: FormGroup;

  storageManagers: any;

  authService = inject(AuthService);
  public user = computed(() => this.authService.currentUser());
  orderId: string = "";

  userId: any = "";
  panelOpenState = true;

  constructor(
    private fb: FormBuilder,
    private readonly sOrder: OrderStaffService,
    private readonly _userService: UserService,
    private readonly _route: ActivatedRoute

  ) {
    this.itemForm = this.fb.group({
      code: ['', [Validators.required]],
      mocode: ['', [Validators.required]],
      comment: ['', [Validators.required]],
      delivered_opt: ['', [Validators.required]],
      storage_manager_id: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getStorageManagers();

    this._route.params.subscribe({
      next: (params) => {
        this.orderId = params['id'];
        // this.getOrders();
      },
      error: (error) => {
        console.error(error);
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

  getOne(){


  }

  onSave() {
    this.sOrder.storeOrder(this.itemForm.value).subscribe({
      next: (resp) => {
        Swal.close();
        Swal.fire({
          title: 'Orden creada',
          text: 'Su orden ha sido creada exitosamente, por favor verifique el estado de la orden en unos minutos.',
          icon: 'success',
          confirmButtonText: 'Entendido',
        });
        this.goBack();
        this.itemForm.reset();
      },
      error: (err) => {
        Swal.close();
        console.log('Error: ', err);
        Swal.fire({
          title: 'Error',
          text: 'Ha ocurrido un error al actualizar la orden.',
          icon: 'error',
        });
      }
    });
  }


  cancel() {
    this.itemForm.reset();
  }

  goBack() {
    window.history.back();
  }
}
