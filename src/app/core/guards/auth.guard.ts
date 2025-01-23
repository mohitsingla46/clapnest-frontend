import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AppService } from '../services/app.services';

export const authGuard: CanActivateFn = (route, state) => {
	const router = inject(Router);
	const appService = inject(AppService);

	const token = localStorage.getItem('token');
	if (!token) {
		router.navigate(['/']);
		return false;
	}

	return appService.profile().pipe(
		map(user => {
			if (!user) {
				router.navigate(['/']);
				return false;
			}
			return true;
		})
	);
};
