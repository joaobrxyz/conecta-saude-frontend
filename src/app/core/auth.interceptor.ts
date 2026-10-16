import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { API_URL } from './api.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const api = inject(API_URL);
  if (!request.url.startsWith(`${api}/`) || request.url.startsWith(`${api}/auth/`) || !auth.session()) return next(request);
  const send = () => next(request.clone({ setHeaders: { Authorization: `Bearer ${auth.session()?.accessToken}` } }));
  if (auth.expired) return auth.refresh().pipe(switchMap(send));
  return send().pipe(catchError((error: HttpErrorResponse) => {
    // Services currently use 403 for expired tokens too. Do not refresh genuine role denials.
    if (error.status === 401 || (error.status === 403 && auth.expired)) {
      return auth.refresh().pipe(switchMap(send));
    }
    return throwError(() => error);
  }));
};
