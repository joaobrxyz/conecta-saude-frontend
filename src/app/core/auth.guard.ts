import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from './auth.service';
import { Role } from './api.models';

export const authGuard: CanActivateFn = route => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const checkRole = () => !route.data['role'] || auth.claims?.role === (route.data['role'] as Role) ? true : router.parseUrl(auth.home);
  if (!auth.session()) return router.parseUrl('/login');
  if (auth.expired) return auth.ensureSession().pipe(map(checkRole), catchError(() => of(router.parseUrl('/login'))));
  return checkRole();
};
export const childAuthGuard: CanActivateChildFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.session()) return router.parseUrl('/login');
  return auth.expired ? auth.ensureSession().pipe(catchError(() => of(router.parseUrl('/login')))) : true;
};
