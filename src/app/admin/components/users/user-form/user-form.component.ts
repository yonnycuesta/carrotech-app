import { Component, inject, Inject, OnInit, Optional, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { IUser } from '../../../../home/interfaces/users/user-page.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { errorMessages, regExps } from '../../../helpers/form-validator';
import { MatError, MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../../services/user.service';
@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatSelectModule, MatLabel,
    MatError, MatInputModule, MatIconModule,
    MatFormFieldModule, MatFormField, ReactiveFormsModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {

  action: string;
  local_data: any;
  cancel: string = 'Cancelar';
  tableForm!: FormGroup;
  errors = errorMessages;

  roles: any;
  status: any;

  hide = signal(true);

  constructor(
    public dialogRef: MatDialogRef<UserFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: IUser,
    private _fb: FormBuilder,
    private _userService: UserService
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    this.creatForm();
    this.tableForm.patchValue(this.local_data);
  }


  ngOnInit(): void {
    this.roles = [
      { value: 'admin', viewValue: 'Administrador' },
      { value: 'guest', viewValue: 'Invitado' },
      { value: 'staff', viewValue: 'Técnico' },
      { value: 'supervisor', viewValue: 'Supervisor' },
      { value: 'storage_manager', viewValue: 'Carro Bodega' }
    ];

    this.status = [
      { value: 'active', viewValue: 'Activo' },
      { value: 'inactive', viewValue: 'Inactivo' }
    ];
  }

  creatForm(): void {
    this.tableForm = this._fb.group({
      name: ['', [Validators.required, Validators.pattern(regExps['str'])]],
      dni: ['', [Validators.required, Validators.pattern(regExps['num'])]],
      email: ['', [Validators.required, Validators.pattern(regExps['email'])]],
      phone: ['', [Validators.required, Validators.pattern(regExps['num'])]],
      role: ['guest', [Validators.required, Validators.pattern(regExps['str'])]],
      statu: ['active', [Validators.required, Validators.pattern(regExps['str'])]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(regExps['min_eight'])]],
    });
  }

  closeDialog() {
    this.dialogRef.close({ data: { action: 'Cancelar' } });
  }

  onSubmit(): void {
    if (this.action === 'Agregar') {
      if (this.tableForm.valid) {
        this._userService.store(this.tableForm.value).subscribe({
          next: (resp) => {
            this.dialogRef.close({ data: { action: this.action, data: this.tableForm.value } });
          },
          error: (err) => {
            console.log(err);
          }
        });
      }
    } else {
      this._userService.update(this.local_data.id, this.tableForm.value).subscribe({
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
