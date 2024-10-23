import { Component, computed, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatLabel, MatError, MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../../home/services/auth/auth.service';
import { NotificationService } from '../../services/notification.service';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-chat-support',
  standalone: true,
  imports: [
    MatDialogModule, MatButtonModule, MatSelectModule, MatLabel,
    MatError, MatInputModule, MatIconModule,
    MatFormFieldModule, MatFormField, ReactiveFormsModule,
  ],
  templateUrl: './chat-support.component.html',
  styleUrl: './chat-support.component.scss',
})
export class ChatSupportComponent implements OnInit {

  storeForm!: FormGroup;
  private authService = inject(AuthService);
  public user = computed(() => this.authService.currentUser());

  constructor(
    public dialogRef: MatDialogRef<ChatSupportComponent>,
    private _fb: FormBuilder,
    private readonly sNotify: NotificationService,
    private readonly sUser: UserService
  ) {
    this.storeForm = this._fb.group({
      user_id: ['', [Validators.required]],
      message: ['', [Validators.required]],
      type: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    try {
      this.sUser.adminUser().subscribe({
        next: (res: any) => {
          this.storeForm.patchValue({
            user_id: res.userId,
            type: 'Soporte'
          });
        },
        error: (err) => {
          console.log(err);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  closeDialog() {
    this.dialogRef.close({ data: { action: 'Cancelar' } });
  }

  onSubmit() {
    try {
      if (this.storeForm.valid) {
        this.sNotify.createNotification(this.storeForm.value).subscribe(
          res => {
            Swal.fire({
              icon: 'success',
              title: 'Mensaje enviado',
              showConfirmButton: false,
              timer: 1500
            });
            this.dialogRef.close({ data: { action: 'Enviar' } });
          },
          error => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Ha ocurrido un error, intente nuevamente',
            });
          }
        );
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Por favor complete todos los campos',
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

}
