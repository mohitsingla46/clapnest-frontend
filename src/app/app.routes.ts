import { Routes } from '@angular/router';
import { guestGuard } from './core/guards/guest.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        canActivate: [guestGuard],
        loadChildren: () => import('./pages/auth/auth.routes').then(m => m.routes),
    },
    {
        path: 'chat',
        canActivate: [authGuard],
        loadChildren: () => import('./pages/chat/chat.routes').then(m => m.routes),
    }
];
