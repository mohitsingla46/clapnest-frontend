import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AppService } from '../services/app.services';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
	const router = inject(Router);
	const appService = inject(AppService);
	const platformId = inject(PLATFORM_ID);

	if (isPlatformBrowser(platformId)) {
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
	}
	return false;
};
