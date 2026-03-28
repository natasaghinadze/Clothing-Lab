import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from "./pages/auth/login/login";
import { Login2 } from './features/auth/pages/login/login';

@Component({
  selector: 'app-root',
  imports: [Login2],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Clothing-Lab');
}
