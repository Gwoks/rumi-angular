import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  isSubmitting = false;
  showSuccess = false;

  onSubmit() {
    this.isSubmitting = true;
    
    // Simulate form submission
    setTimeout(() => {
      this.isSubmitting = false;
      this.showSuccess = true;
      this.resetForm();
      
      setTimeout(() => {
        this.showSuccess = false;
      }, 3000);
    }, 2000);
  }

  resetForm() {
    this.contactForm = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  }
}
