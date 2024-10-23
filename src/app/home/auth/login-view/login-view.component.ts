import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgToastModule, NgToastService, ToasterPosition } from 'ng-angular-popup';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    NgToastModule,
    RouterModule,
    MatIconModule
  ],
  templateUrl: './login-view.component.html',
  styleUrl: './login-view.component.scss'
})
export class LoginViewComponent implements OnInit {

  formLogin!: FormGroup;
  toast = inject(NgToastService);
  ToasterPosition = ToasterPosition;
  submitted: boolean = false;
  hidePassword = true;
  logo: string = "assets/images/logo.png";

  constructor(
    private fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,

  ) {
    this.formLogin = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(7)]],
    });
  }

  ngOnInit() { }

  onLogin() {
    if (this.isValidForm()) {
      this.formLogin.value.username = this.formLogin.value.username.toString();
      this.authService.login(this.formLogin.value).subscribe({
        next: (resp: any) => {
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          console.log(err);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al iniciar sesión.'
          });
        },
      });
    }
  }

  get f() {
    return this.formLogin.controls;
  }
  isValidForm(): boolean {
    if (this.formLogin.invalid) {
      return false;
    }
    return true;
  }

}
