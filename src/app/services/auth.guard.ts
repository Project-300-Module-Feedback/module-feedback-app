import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, Role } from './auth.service';

// any page you need to be logged in for
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) return true;

  auth.logout();
  return router.createUrlTree(['/login']);
};

// pages only some roles can open, e.g. roleGuard('admin')
export function roleGuard(...roles: Role[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const user = auth.user();

    if (!auth.isLoggedIn() || !user) {
      auth.logout();
      return router.createUrlTree(['/login']);
    }

    if (roles.includes(user.role)) return true;

    // logged in but wrong role, send them back to their own page
    return router.createUrlTree([auth.homePage()]);
  };
}