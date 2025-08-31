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
  currentPage = 1;
  totalPages = 1;
  totalChildren = 0;
  limit = 10;
  isAdmin = false;

  constructor(
    private childrenService: ChildrenService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.childForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      nick_name: ['', [Validators.maxLength(50)]],
      birth_date: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.checkUserRole();
    this.checkAuthStatus();
    this.loadChildren();
  }

  checkAuthStatus(): void {
    const user = this.authService.currentUserValue;
    const token = this.authService.getToken();
    const isValid = this.authService.isTokenValid();
    
    if (!user || !token || !isValid) {
      if (!isValid) {
        this.authService.clearInvalidSession();
      }
      // Redirect to login if not authenticated
      alert('Your session has expired. Please log in again.');
      this.router.navigate(['/login']);
      return;
    }
  }

  checkUserRole(): void {
    const user = this.authService.currentUserValue;
    this.isAdmin = user?.role === 'admin';
  }

  loadChildren(): void {
    // Check authentication before loading
    if (!this.authService.isTokenValid()) {
      this.authService.clearInvalidSession();
      this.router.navigate(['/login']);
      return;
    }
    
    this.loading = true;
    
    const loadMethod = this.isAdmin ? 
      this.childrenService.getAllChildren(this.currentPage, this.limit) :
      this.childrenService.getChildren(this.currentPage, this.limit);

    loadMethod.subscribe({
      next: (response) => {
        if (response.success) {
          this.children = response.data;
          if (response.pagination) {
            this.totalPages = response.pagination.total_pages;
            this.totalChildren = response.pagination.total;
          }
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading children:', error);
        this.loading = false;
        
        if (error.status === 401) {
          alert('Your session has expired. Please log in again.');
          this.authService.clearInvalidSession();
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
      birth_date: this.childrenService.formatDateForInput(child.birth_date)
    });
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingChild = null;
    this.childForm.reset();
  }

  onSubmit(): void {
    // Check authentication before submitting
    if (!this.authService.isTokenValid()) {
      alert('Your session has expired. Please log in again.');
      this.router.navigate(['/login']);
      return;
    }
    
    if (this.childForm.valid) {
      const formData = this.childForm.value;
      
      if (this.editingChild) {
        // Update existing child
        const updateData: UpdateChildRequest = {
          name: formData.name,
          nick_name: formData.nick_name || '',
          birth_date: formData.birth_date
        };

        this.childrenService.updateChild(this.editingChild.id, updateData).subscribe({
          next: (response) => {
            if (response.success) {
              this.loadChildren();
              this.closeForm();
            }
          },
          error: (error) => {
            console.error('Error updating child:', error);
          }
        });
      } else {
        // Create new child
        const createData: CreateChildRequest = {
          name: formData.name,
          nick_name: formData.nick_name || '',
          birth_date: formData.birth_date
        };
        


        this.childrenService.createChild(createData).subscribe({
          next: (response) => {
            if (response.success) {
              this.loadChildren();
              this.closeForm();
              alert('Child added successfully!');
            } else {
              alert(`Error: ${response.message || 'Failed to create child'}`);
            }
          },
          error: (error) => {
            console.error('Error creating child:', error);
            let errorMessage = 'Failed to create child';
            
            if (error.status === 401) {
              errorMessage = 'You need to log in again to perform this action';
              // Redirect to login for 401 errors
              setTimeout(() => {
                this.authService.clearInvalidSession();
                this.router.navigate(['/login']);
              }, 2000);
            } else if (error.status === 403) {
              errorMessage = 'You do not have permission to create children';
            } else if (error.error?.message) {
              errorMessage = error.error.message;
            } else if (error.message) {
              errorMessage = error.message;
            }
            
            alert(`Error: ${errorMessage}`);
          }
        });
      }
    } else {
      alert('Please fill in all required fields correctly');
    }
  }

  deleteChild(child: Child): void {
    if (confirm(`Are you sure you want to delete ${child.name}?`)) {
      this.childrenService.deleteChild(child.id).subscribe({
        next: (response) => {
          this.loadChildren();
        },
        error: (error) => {
          console.error('Error deleting child:', error);
        }
      });
    }
  }

  toggleChildStatus(child: Child): void {
    if (!this.isAdmin) return;
    
    this.childrenService.setChildActive(child.id, !child.is_active).subscribe({
      next: (response) => {
        this.loadChildren();
      },
      error: (error) => {
        console.error('Error updating child status:', error);
      }
    });
  }

  getAge(birthDate: string): number {
    return this.childrenService.calculateAge(birthDate);
  }

  formatDate(dateString: string): string {
    return this.childrenService.formatDate(dateString);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadChildren();
    }
  }

  getPaginationPages(): number[] {
    const pages: number[] = [];
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, this.currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  getDisplayRange(): { start: number; end: number } {
    const start = (this.currentPage - 1) * this.limit + 1;
    const end = Math.min(this.currentPage * this.limit, this.totalChildren);
    return { start, end };
  }

  getFormErrors(): any {
    const errors: any = {};
    Object.keys(this.childForm.controls).forEach(key => {
      const controlErrors = this.childForm.get(key)?.errors;
      if (controlErrors) {
        errors[key] = controlErrors;
      }
    });
    return errors;
  }

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  // Debug method to force form validation
  forceValidation(): void {
    Object.keys(this.childForm.controls).forEach(key => {
      this.childForm.get(key)?.markAsTouched();
      this.childForm.get(key)?.updateValueAndValidity();
    });
    console.log('Form validation forced:', this.childForm.valid);
    console.log('Form errors:', this.getFormErrors());
  }

  // Test method to fill form with valid data
  testForm(): void {
    this.childForm.patchValue({
      name: 'Test Child',
      nick_name: 'Testy',
      birth_date: '2020-01-15'
    });
    this.forceValidation();
    console.log('Test data filled. Form should now be valid:', this.childForm.valid);
  }
}
