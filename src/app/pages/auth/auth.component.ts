import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginCredentials, SignupCredentials } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  isLogin = true;
  isLoading = false;
  errorMessage = '';

  loginForm: LoginCredentials = {
    email: '',
    password: ''
  };

  signupForm: SignupCredentials = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.errorMessage = '';
    this.resetForms();
  }

  resetForms() {
    this.loginForm = { email: '', password: '' };
    this.signupForm = { name: '', email: '', password: '', confirmPassword: '' };
  }

  onLogin() {
    if (!this.loginForm.email || !this.loginForm.password) {
      this.errorMessage = 'Mohon isi semua field';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Login gagal. Silakan coba lagi.';
      }
    });
  }

  onSignup() {
    if (!this.signupForm.name || !this.signupForm.email || !this.signupForm.password) {
      this.errorMessage = 'Mohon isi semua field';
      return;
    }

    if (this.signupForm.password !== this.signupForm.confirmPassword) {
      this.errorMessage = 'Password tidak cocok';
      return;
    }

    if (this.signupForm.password.length < 6) {
      this.errorMessage = 'Password harus minimal 6 karakter';
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
    if (this.isLogin) {
      this.onLogin();
    } else {
      this.onSignup();
    }
  }
}
