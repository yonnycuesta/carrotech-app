import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {

  const token = localStorage.getItem('token');
  const router = inject(Router);

  if (!token) {
    return true;
  }
  router.navigateByUrl('/dashboard');
  return false;
};
