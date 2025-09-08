import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from './auth.service';
import {inject} from '@angular/core';
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Vérifier si l'utilisateur est connecté
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // Vérifier si la route nécessite un utilisateur actif
  const requiresActiveUser = route.data?.['isActive'];
  if (requiresActiveUser && !authService.getisActive()) {
    // Déconnecter l'utilisateur et rediriger vers login avec message d'erreur
    authService.logout();
    router.navigate(['/login'], {
      queryParams: { error: 'account_inactive' }
    });
    return false;
  }

  // Vérifier le rôle si spécifié
  const requiredRole = route.data?.['role'];
  if (requiredRole) {
    const userRole = authService.getUserRole();

    if (userRole === requiredRole) {
      return true;
    } else {
      // Redirection basée sur le rôle
      if (userRole === 'admin') {
        router.navigate(['/admin']);
      } else {
        router.navigate(['/home']);
      }
      return false;
    }
  }

  return true;
};
