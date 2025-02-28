import { HttpEvent, HttpHandler, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, first, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('token');
  const authService = inject(AuthService);

  if (token && authService.isTokenExpired(token)) {
    authService.logout(); // Si el token expiró, desloguea y redirige
    return next(req); // Continúa (opcional, podrías lanzar un error aquí)
  }


  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(authReq);
  }
  return next(req);


};
