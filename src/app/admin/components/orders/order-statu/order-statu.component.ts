import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatError, MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { OrderService } from '../../../services/order.service';
import { AlertService } from '../../../services/alert.service';
import { OrderStaffService } from '../../../services/order-staff.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-statu',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule, MatSelectModule, MatLabel,
    MatError, MatInputModule, MatIconModule,
    MatFormFieldModule, MatFormField
  ],
  templateUrl: './order-statu.component.html',
  styleUrl: './order-statu.component.scss'
})
export class OrderStatuComponent implements OnInit {

  statuForm!: FormGroup;
  local_data: any;
  status: any;

  constructor(
    public dialogRef: MatDialogRef<OrderStatuComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private readonly sOrder: OrderService,
    private sOrderSatff: OrderStaffService,
    private readonly alertService: AlertService
  ) {
    this.local_data = { ...data };
    this.creatForm();

  }

  ngOnInit(): void {

    this.sOrder.getStatus().subscribe({
      next: (resp) => {
        this.status = resp;
        this.statuForm.patchValue({
          order_id: this.local_data.order_id,
          statu: this.local_data.statu.toUpperCase()
        });
      },
      error: (err) => {
        console.log('Error: ', err);
      }
    })
  }
  creatForm(): void {
    this.statuForm = this._fb.group({
      order_id: ['', [Validators.required]],
      statu: ['', [Validators.required]],
      comment: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  closeDialog() {
    this.dialogRef.close({ data: { action: 'Cancelar' } });
  }


  onSubmit() {
    const options = {
      title: 'Actualizar Estado',
      message: `¿Estás seguro de actualizar el estado?`,
      cancelText: 'NO',
      confirmText: 'SI',
    };

    this.alertService.open(options);
    this.alertService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.statuForm.value.statu = this.statuForm.value.statu.toLowerCase();
        this.sOrderSatff.updateStatus(this.statuForm.value.order_id, this.statuForm.value).subscribe({
          next: (resp) => {
            this.dialogRef.close({ data: { action: 'Actualizar' } });
            this.statuForm.reset();
          },
          error: (err) => {
            console.log('Error: ', err);
          }
        });
      } else {
        this.statuForm.reset();
        Swal.fire({
          title: 'Cancelado',
          text: 'No se realizó ninguna acción',
          icon: 'info',
        });
      }
    });
  }
}
