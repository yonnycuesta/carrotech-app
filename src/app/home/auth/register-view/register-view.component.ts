import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgToastModule, NgToastService, ToasterPosition } from 'ng-angular-popup';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { regExps } from '../../../admin/helpers/form-validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatError,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './register-view.component.html',
  styleUrl: './register-view.component.scss'
})
export class RegisterViewComponent implements OnInit {

  registroForm!: FormGroup;
  hide = true;

  constructor(private fb: FormBuilder,
    private readonly sAuth: AuthService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      dni: ['', [Validators.required, Validators.minLength(7), Validators.pattern(regExps['min_eight'])]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$')]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.checkPasswords });
  }


  checkPasswords(group: FormGroup) {
    let pass = group.get('password')?.value;
    let confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { notSame: true };
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.registroForm.get(controlName)?.hasError(errorName) ?? false;
  }

  onSubmit() {
    if (this.registroForm.valid) {
      this.registroForm.value.phone = this.registroForm.value.phone.toString();
      this.registroForm.value.dni = this.registroForm.value.dni.toString();
      this.sAuth.register(this.registroForm.value).subscribe({
        next: (resp: any) => {
          Swal.fire({
            title: 'Registro Exitoso',
            text: 'Se ha registrado correctamente',
            icon: 'success',
            timer: 1000
          });
          this.router.navigateByUrl('/login');
          this.registroForm.reset();
        },
        error: (err) => {
          console.log(err);
          Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error al registrar',
            icon: 'error',
          });
        }
      });
    }
  }
}
