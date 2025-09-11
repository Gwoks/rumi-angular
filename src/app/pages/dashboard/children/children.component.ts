import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChildrenService, Child, CreateChildRequest, UpdateChildRequest } from '../../../services/children.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-children',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './children.component.html',
  styleUrls: ['./children.component.css']
})
export class ChildrenComponent implements OnInit {
  children: Child[] = [];
  loading = false;
  showForm = false;
  editingChild: Child | null = null;
  childForm: FormGroup;
  isAdmin = false;

  constructor(
    private childrenService: ChildrenService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.childForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      nick_name: [''],
      birth_date: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.currentUserValue?.role === 'admin';
    this.loadChildren();
  }

  loadChildren(): void {
    this.loading = true;
    
    const loadMethod = this.isAdmin ? 
      this.childrenService.getAllChildren(1, 50) :
      this.childrenService.getChildren(1, 50);

    loadMethod.subscribe({
      next: (response) => {
        this.children = response.success ? response.data : [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading children:', error);
        this.children = [];
        this.loading = false;
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  openCreateForm(): void {
    this.editingChild = null;
    this.childForm.reset();
    this.showForm = true;
  }

  openEditForm(child: Child): void {
    this.editingChild = child;
    this.childForm.patchValue({
      name: child.name,
      nick_name: child.nick_name,
      birth_date: this.formatDateForInput(child.birth_date)
    });
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingChild = null;
    this.childForm.reset();
  }

  onSubmit(): void {
    if (!this.childForm.valid) {
      alert('Please fill in all required fields correctly');
      return;
    }

    const formData = this.childForm.value;
    
    if (this.editingChild) {
      // Update child
      const updateData: UpdateChildRequest = {
        name: formData.name.trim(),
        nick_name: formData.nick_name?.trim() || '',
        birth_date: formData.birth_date
      };

      this.childrenService.updateChild(this.editingChild.id, updateData).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Child updated successfully!');
            this.loadChildren();
            this.closeForm();
          } else {
            alert('Error: ' + response.message);
          }
        },
        error: (error) => {
          console.error('Error updating child:', error);
          alert('Failed to update child');
        }
      });
    } else {
      // Create child
      const createData: CreateChildRequest = {
        name: formData.name.trim(),
        nick_name: formData.nick_name?.trim() || '',
        birth_date: formData.birth_date
      };

      this.childrenService.createChild(createData).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Child added successfully!');
            this.loadChildren();
            this.closeForm();
          } else {
            alert('Error: ' + response.message);
          }
        },
        error: (error) => {
          console.error('Error creating child:', error);
          alert('Failed to create child');
        }
      });
    }
  }

  deleteChild(child: Child): void {
    if (confirm(`Delete ${child.name}?`)) {
      this.childrenService.deleteChild(child.id).subscribe({
        next: () => {
          alert('Child deleted successfully!');
          this.loadChildren();
        },
        error: (error) => {
          console.error('Error deleting child:', error);
          alert('Failed to delete child');
        }
      });
    }
  }

  toggleChildStatus(child: Child): void {
    if (!this.isAdmin) return;
    
    this.childrenService.setChildActive(child.id, !child.is_active).subscribe({
      next: () => this.loadChildren(),
      error: (error) => {
        console.error('Error updating child status:', error);
        alert('Failed to update child status');
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  formatDateForInput(dateString: string): string {
    return new Date(dateString).toISOString().split('T')[0];
  }

  calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}