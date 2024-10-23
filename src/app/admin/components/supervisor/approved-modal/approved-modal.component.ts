import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatLabel, MatError, MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { OrderSupervisorService } from '../../../services/order-supervisor.service';

@Component({
  selector: 'app-approved-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule, MatSelectModule, MatLabel,
    MatError, MatInputModule, MatIconModule,
    MatFormFieldModule, MatFormField
  ],
  templateUrl: './approved-modal.component.html',
  styleUrl: './approved-modal.component.scss'
})
export class ApprovedModalComponent implements OnInit {

  statuForm!: FormGroup;
  local_data: any;
  status: any;
  orderId: string = '';

  constructor(
    public dialogRef: MatDialogRef<ApprovedModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private sOrder: OrderSupervisorService,
  ) {
    this.local_data = { ...data };
    this.creatForm();

  }

  ngOnInit(): void {
    this.orderId = this.local_data.order_id;
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
    this.statuForm.value.statu = this.statuForm.value.statu.toLowerCase();
    this.statuForm.value.order_id = this.orderId;
    this.sOrder.updateStatus(this.orderId, this.statuForm.value).subscribe({
      next: (resp) => {
        this.dialogRef.close({ data: { action: 'Actualizado' } });
        this.statuForm.reset();
      },
      error: (err) => {
        console.log('Error: ', err);
      }
    });
  }

}
