import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-design-template',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './design-template.component.html',
  styleUrls: ['./design-template.component.css']
})
export class DesignTemplateComponent implements OnInit {
  // Form examples
  sampleForm: FormGroup;
  showModal = false;
  showAlert = false;
  alertType: 'success' | 'error' | 'warning' | 'info' = 'success';
  alertMessage = 'This is a sample alert message';
  
  // Sample data
  sampleTableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Inactive' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Active' }
  ];

  // Chart sample data
  chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Users',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 2
    }]
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.sampleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^\d{10,15}$/)]],
      role: ['user', Validators.required],
      bio: [''],
      newsletter: [false],
      birthDate: [''],
      country: ['']
    });
  }

  ngOnInit(): void {
    // Check if user is admin
    const user = this.authService.currentUserValue;
    if (!user || user.role !== 'admin') {
      this.router.navigate(['/dashboard']);
      return;
    }
  }

  onSampleSubmit(): void {
    if (this.sampleForm.valid) {
      this.showAlertMessage('Form submitted successfully!', 'success');
    } else {
      this.showAlertMessage('Please fill in all required fields correctly', 'error');
    }
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  showAlertMessage(message: string, type: 'success' | 'error' | 'warning' | 'info'): void {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      this.showAlert = false;
    }, 3000);
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.showAlertMessage('Code copied to clipboard!', 'success');
    });
  }
}
