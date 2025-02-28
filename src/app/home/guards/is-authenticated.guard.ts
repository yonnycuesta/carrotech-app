import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStatus } from '../interfaces/auth/auth-status.enum';
import { map, take } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const token = localStorage.getItem('token');

  //  if (authService.authStatus() === AuthStatus.authenticated) {
  //     return true;
  //   }
  //   if (authService.authStatus() === AuthStatus.checking) {
  //     return false;
  //   }

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;

  // if (token) {
  //   return true;
  // }

  // const url = state.url;
  // localStorage.setItem('url', url);
  // router.navigateByUrl('/login');
  // return false;
};


