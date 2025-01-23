import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AppService } from '../services/app.services';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const appService = inject(AppService);

  const token = localStorage.getItem('token');
  if (!token) {
    return true;
  }

  return appService.profile().pipe(
    map(user => {
      if (user) {
        router.navigate(['/chat']);
        return false;
      }
      return true;
    })
  );
};
