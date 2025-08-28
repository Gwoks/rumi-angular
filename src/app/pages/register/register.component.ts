import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, SignupCredentials } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  isLoading = false;
  errorMessage = '';

  signupForm: SignupCredentials = {
    email: '',
    password: '',
    phone: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSignup() {
    if (!this.signupForm.email || !this.signupForm.password || !this.signupForm.phone) {
      this.errorMessage = 'Mohon isi semua field';
      return;
    }

    if (this.signupForm.password.length < 6) {
      this.errorMessage = 'Password harus minimal 6 karakter';
      return;
    }

    // Basic phone number validation for Indonesian format
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
    if (!phoneRegex.test(this.signupForm.phone)) {
      this.errorMessage = 'Format nomor telepon tidak valid';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.signup(this.signupForm).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Registrasi gagal. Silakan coba lagi.';
      }
    });
  }

  onSubmit() {
    this.onSignup();
  }
}