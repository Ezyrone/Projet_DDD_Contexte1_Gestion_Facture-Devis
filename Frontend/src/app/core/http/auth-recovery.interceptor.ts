import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

const AUTH_RETRY_HEADER = 'x-auth-retried';
const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];

export const authRecoveryInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: unknown) => {
      const isUnauthorized = error instanceof HttpErrorResponse && error.status === 401;
      const alreadyRetried = req.headers.has(AUTH_RETRY_HEADER);
      const isAuthEndpoint = AUTH_ENDPOINTS.some((endpoint) => req.url.includes(endpoint));

      if (!isUnauthorized || alreadyRetried || isAuthEndpoint) {
        return throwError(() => error);
      }

      return authService.refreshToken().pipe(
        switchMap(() => next(req.clone({ headers: req.headers.set(AUTH_RETRY_HEADER, '1') }))),
        catchError((refreshError) => {
          authService.clearSession();
          void router.navigate(['/login']);
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
