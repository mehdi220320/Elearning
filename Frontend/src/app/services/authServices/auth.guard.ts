import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from './auth.service';
import {inject} from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const requiredRole = route.data?.['role'];

  if (!requiredRole) {
    return true;
  }

  const userRole = authService.getUserRole();

  if (userRole === requiredRole) {
    return true;
  } else {
    if (userRole === 'admin') {
      router.navigate(['/admin']);
    } else {
      router.navigate(['/home']);
    }
    return false;
  }
};
