import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  message = '';

  forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  async onSubmit() {
  if (this.forgotPasswordForm.invalid) {
    this.message = 'გთხოვთ შეიყვანოთ სწორი ელფოსტა';
    return;
  }

  const email = this.forgotPasswordForm.value.email!;

  try {
    await this.authService.forgotPassword(email);
    this.message = 'პაროლის აღდგენის ბმული გამოგზავნილია ელფოსტაზე';
  } catch (error: any) {
    this.message = error?.code || error?.message || 'შეცდომა';
  }
}
}
