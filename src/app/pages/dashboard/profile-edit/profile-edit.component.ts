import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService, User } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  @Input() user: User | null = null;

  profileForm: FormGroup;
  passwordForm: FormGroup;
  
  loading = false;
  profileLoading = false;
  passwordLoading = false;
  
  profileMessage = '';
  passwordMessage = '';
  profileError = '';
  passwordError = '';

  activeTab = 'profile';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private apiService: ApiService
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15)]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    if (this.user) {
      this.profileForm.patchValue({
        name: this.user.name,
        phone: this.user.phone
      });
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
    } else if (confirmPassword?.errors?.['mismatch']) {
      confirmPassword.setErrors(null);
    }
    return null;
  }

  getAuthHeaders() {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.clearMessages();
  }

  clearMessages() {
    this.profileMessage = '';
    this.passwordMessage = '';
    this.profileError = '';
    this.passwordError = '';
  }

  updateProfile() {
    if (this.profileForm.invalid) return;

    this.profileLoading = true;
    this.clearMessages();

    const formData = this.profileForm.value;
    const url = `${this.apiService.apiUrl}/profile`;
    
    this.http.put<ApiResponse>(url, formData, this.getAuthHeaders()).subscribe({
      next: (response) => {
        this.profileLoading = false;
        if (response.success) {
          this.profileMessage = 'Profile updated successfully!';
          // Update the user data in auth service
          if (response.data && this.user) {
            this.user.name = response.data.name;
            this.user.phone = response.data.phone;
            // Update the current user in the auth service
            this.authService.updateCurrentUser(response.data);
          }
        } else {
          this.profileError = response.error?.message || 'Failed to update profile';
        }
      },
      error: (error) => {
        this.profileLoading = false;
        console.error('Error updating profile:', error);
        this.profileError = error.error?.error?.message || error.error?.message || 'Failed to update profile';
      }
    });
  }

  changePassword() {
    if (this.passwordForm.invalid) return;

    this.passwordLoading = true;
    this.clearMessages();

    const formData = {
      current_password: this.passwordForm.value.currentPassword,
      new_password: this.passwordForm.value.newPassword
    };
    const url = `${this.apiService.apiUrl}/profile/password`;
    
    this.http.put<ApiResponse>(url, formData, this.getAuthHeaders()).subscribe({
      next: (response) => {
        this.passwordLoading = false;
        if (response.success) {
          this.passwordMessage = 'Password changed successfully!';
          this.passwordForm.reset();
        } else {
          this.passwordError = response.error?.message || 'Failed to change password';
        }
      },
      error: (error) => {
        this.passwordLoading = false;
        console.error('Error changing password:', error);
        this.passwordError = error.error?.error?.message || error.error?.message || 'Failed to change password';
      }
    });
  }

  // Helper methods for form validation
  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
    if (!field || !field.errors) return '';

    const errors = field.errors;
    if (errors['required']) return `${this.getFieldLabel(fieldName)} is required`;
    if (errors['minlength']) return `${this.getFieldLabel(fieldName)} must be at least ${errors['minlength'].requiredLength} characters`;
    if (errors['maxlength']) return `${this.getFieldLabel(fieldName)} cannot exceed ${errors['maxlength'].requiredLength} characters`;
    if (errors['mismatch']) return 'Passwords do not match';

    return 'Invalid input';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Name',
      phone: 'Phone',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password'
    };
    return labels[fieldName] || fieldName;
  }

  // Utility method to format phone numbers
  formatPhoneNumber(phone: string): string {
    // Simple phone number formatting
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length >= 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  }
}
