import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { UserRole } from '../auth/auth.types';

function getAllowedRoles(route: ActivatedRouteSnapshot): UserRole[] {
  return (route.data['roles'] as UserRole[] | undefined) ?? [];
}

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUser();
  const allowedRoles = getAllowedRoles(route);

  if (!user) {
    return router.createUrlTree(['/login']);
  }

  if (allowedRoles.length === 0 || allowedRoles.includes(user.role)) {
    return true;
  }

  return router.createUrlTree(['/403']);
};
