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
    name: '',
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
        console.log('Signup successful:', response);
        // Redirect to dashboard on successful registration
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Signup error:', error);
        
        // Handle different types of errors
        if (error.error?.error?.message) {
          this.errorMessage = error.error.error.message;
        } else if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.message) {
          this.errorMessage = error.message;
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }

        // If there's a server error, redirect to home after showing error
        if (error.status === 500) {
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 3000);
        }
      }
    });
  }

  onSubmit() {
    this.onSignup();
  }
}