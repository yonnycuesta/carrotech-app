import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgToastModule, NgToastService, ToasterPosition } from 'ng-angular-popup';
import { AuthService } from '../../services/auth/auth.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-password-forgot',
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
  templateUrl: './password-forgot.component.html',
  styleUrl: './password-forgot.component.scss'
})
export class PasswordForgotComponent implements OnInit {
  formLogin!: FormGroup;
  toast = inject(NgToastService);
  ToasterPosition = ToasterPosition;
  submitted: boolean = false;
  hide = true;

  constructor(
    private fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    this.formLogin = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$')]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.checkPasswords });
  }

  ngOnInit() { }


  isValidForm(): boolean {
    if (this.formLogin.invalid) {
      return false;
    }
    return true;
  }

  checkPasswords(group: FormGroup) {
    let pass = group.get('password')?.value;
    let confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { notSame: true };
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.formLogin.get(controlName)?.hasError(errorName) ?? false;
  }

  save() {
    if (this.formLogin.valid) {
      this.formLogin.value.username = this.formLogin.value.username.toString();
      this.authService.passworRecovery(this.formLogin.value).subscribe({
        next: (resp: any) => {
          this.toast.success(resp.massage);
          this.router.navigateByUrl('/');
        },
        error: (err: any) => {
          console.log(err);
          this.toast.danger('Error al intentar recuperar la contraseña');
        },
      });
    }
  }
}
