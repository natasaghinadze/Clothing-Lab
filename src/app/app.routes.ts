import { Routes } from '@angular/router';
import { Login2 } from './features/auth/pages/login/login';
import { ForgotPassword } from './features/auth/pages/forgot-password/forgot-password';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login2 },
  { path: 'forgot-password', component: ForgotPassword },
  { path: '**', redirectTo: 'login' }
];