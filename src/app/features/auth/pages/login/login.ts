import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login2',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true
})
export class Login2 {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  message = '';
  loading = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  async login() {
    this.loading = true;

    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    try {
      await this.authService.login(email!, password!);
      this.router.navigate(['/admin']);
    } catch { 
    } finally {
      this.loading = false;
    }
  }
}
