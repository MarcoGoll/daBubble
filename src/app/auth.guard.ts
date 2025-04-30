import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from './_shared/services/firebase/authentication.service';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  if (await authService.checkLogin()) {
    return true;
  } else {
    return router.createUrlTree(['/login']);
  }
};
