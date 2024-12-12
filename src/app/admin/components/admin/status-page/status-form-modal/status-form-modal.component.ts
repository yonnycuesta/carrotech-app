import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatLabel, MatError, MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { errorMessages, regExps } from '../../../../helpers/form-validator';
import { OrderService } from '../../../../services/order.service';
import { IUser } from '../../../../../home/interfaces/users/user-page.interface';

@Component({
  selector: 'app-status-form-modal',
  standalone: true,
  imports: [
    MatDialogModule, MatButtonModule, MatSelectModule, MatLabel,
    MatError, MatInputModule, MatIconModule,
    MatFormFieldModule, MatFormField, ReactiveFormsModule,
  ],
  templateUrl: './status-form-modal.component.html',
  styleUrl: './status-form-modal.component.scss'
})
export class StatusFormModalComponent {
  action: string;
  local_data: any;
  cancel: string = 'Cancelar';
  tableForm!: FormGroup;
  errors = errorMessages;

  constructor(
    public dialogRef: MatDialogRef<StatusFormModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: IUser,
    private _fb: FormBuilder,
    private _orderService: OrderService
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    this.creatForm();
    this.tableForm.patchValue(this.local_data);
  }

  creatForm(): void {
    this.tableForm = this._fb.group({
      spanish_name: ['', [Validators.required, Validators.pattern(regExps['str'])]],
      english_name: ['', [Validators.required, Validators.pattern(regExps['str'])]],
    });
  }

  closeDialog() {
    this.dialogRef.close({ data: { action: 'Cancelar' } });
  }

  onSubmit(): void {
    if (this.action === 'Agregar') {
      if (this.tableForm.valid) {
        this._orderService.storeStatus(this.tableForm.value).subscribe({
          next: (resp) => {
            this.dialogRef.close({ data: { action: this.action, data: this.tableForm.value } });
          },
          error: (err) => {
            console.log(err);
          }
        });
      }
    } else {
      this._orderService.updateStatus(this.local_data.id, this.tableForm.value).subscribe({
        next: (resp) => {
          this.dialogRef.close({ data: { action: this.action, data: this.tableForm.value } });
        },
        error: (err) => {
          console.log(err);
        }
      });
    }

  }

}
