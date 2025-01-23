import { Routes } from '@angular/router';
import { authGuard } from 'src/app/core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        canActivate: [authGuard],
        loadComponent : () => import('./chats/chats.component').then(m => m.ChatsComponent)
      },
      {
        path: 'detail/:id',
        canActivate: [authGuard],
        loadComponent : () => import('./detail/detail.component').then(m => m.DetailComponent)
      },
      {
        path: 'new',
        canActivate: [authGuard],
        loadComponent : () => import('./new/new.component').then(m => m.NewComponent)
      }
    ]
  }
];
