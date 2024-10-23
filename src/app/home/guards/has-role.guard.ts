import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStatus } from '../interfaces/auth/auth-status.enum';
import { AuthService } from '../services/auth/auth.service';

export const hasRoleGuard: CanActivateFn = (route, state) => {

  const allowedRoles = route.data?.['allowedRoles'];
  const authService = inject(AuthService);
  const router = inject(Router);
  const role = authService.getRole();

  if (authService.authStatus() === AuthStatus.authenticated) {
    if (!allowedRoles || allowedRoles.length === 0) {
      return false;
    }
    if (allowedRoles.includes(role)) {
      return true;
    }
  } else {
    router.navigateByUrl('/login');
  }
  return false;

};
