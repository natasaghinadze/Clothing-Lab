import { Routes } from '@angular/router';
import { Login2 } from './features/auth/pages/login/login';
import { ForgotPassword } from './features/auth/pages/forgot-password/forgot-password';

// export const routes: Routes = [
//   { path: '', redirectTo: 'login', pathMatch: 'full' },
//   { path: 'login', component: Login2 },
//   { path: 'forgot-password', component: ForgotPassword },
//   { path: '**', redirectTo: 'login' }
// ];

export const routes: Routes =[
  {
    path: 'login',
    canActivate:[],
    loadComponent: () => 
      import('./features/auth/pages/login/login').then(m => m.Login2)
  },
  {
    path:'admin',
    canActivate:[],
    loadComponent: () =>
      import('./features/admin/admin').then(m => m.Admin)
  },
  {
    path: '**',
    redirectTo: 'login',
  },
]
