import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    const userRole = authService.getUserRole();

    if (userRole === 'admin') {
      router.navigate(['/admin']);
    } else {
      router.navigate(['/home']);
    }
    return false;
  }

  return true;
};
