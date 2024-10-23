import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { IItem } from '../../../interfaces/order-interface';
import { errorMessages } from '../../../helpers/form-validator';
import { CommonModule } from '@angular/common';
import { MatError, MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { OrderStaffService } from '../../../services/order-staff.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-order-item-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule, MatSelectModule, MatLabel,
    MatError, MatInputModule, MatIconModule,
    MatFormFieldModule, MatFormField
  ],
  templateUrl: './order-item-edit.component.html',
  styleUrl: './order-item-edit.component.scss'
})
export class OrderItemEditComponent implements OnInit {


  action: string;
  local_data: any;
  cancel: string = 'Cancelar';
  itemForm!: FormGroup;
  errors = errorMessages;
  itemId: string = '';

  constructor(
    public dialogRef: MatDialogRef<OrderItemEditComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: IItem,
    private _fb: FormBuilder,
    private readonly sOrder: OrderStaffService,
    private readonly alertService: AlertService
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    this.itemId = this.local_data.id;
    this.creatForm();
    this.itemForm.patchValue(this.local_data);
  }

  ngOnInit(): void {
  }

  creatForm(): void {
    this.itemForm = this._fb.group({
      item_name: [{ value: '', disabled: true }, [Validators.required]],
      item_qty: ['', [Validators.required, Validators.min(1)]],
      item_unit: [{ value: 'und', disabled: true }]
    });
  }



  closeDialog() {
    this.dialogRef.close({ data: { action: 'Cancelar' } });
  }


  onSubmit() {
    const options = {
      title: 'Actualizar Componente',
      message: `¿Estás seguro de actualiza el item?`,
      cancelText: 'NO',
      confirmText: 'SI',
    };

    this.alertService.open(options);
    this.alertService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.sOrder.updateItems(this.itemId, this.itemForm.value).subscribe({
          next: (resp) => {
            this.dialogRef.close({ data: { action: 'Actualizar' } });
            this.itemForm.reset();
          },
          error: (err) => {
            console.log('Error: ', err);
          }
        });
      }
    });
  }

}
