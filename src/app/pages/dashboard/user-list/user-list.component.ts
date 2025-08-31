import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, User } from '../../../services/auth.service';
import { UserService, CreateUserRequest, UpdateUserRequest } from '../../../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  limit = 10;
  total = 0;
  Math = Math; // Make Math available in template

  // Modal states
  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;
  selectedUser: User | null = null;

  // Forms
  createForm: FormGroup;
  editForm: FormGroup;

  // Filter and search
  searchTerm = '';
  roleFilter = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.createForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user', [Validators.required]]
    });

    this.editForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      role: ['user', [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadUsers();
  }



  loadUsers() {
    this.loading = true;
    
    this.userService.getAllUsers(this.currentPage, this.limit).subscribe({
      next: (response) => {
        this.users = response.data;
        this.currentPage = response.pagination.page;
        this.totalPages = response.pagination.total_pages;
        this.total = response.pagination.total;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  // Create User
  openCreateModal() {
    this.showCreateModal = true;
    this.createForm.reset();
    this.createForm.patchValue({ role: 'user' });
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.createForm.reset();
  }

  createUser() {
    if (this.createForm.invalid) return;

    const formData: CreateUserRequest = this.createForm.value;
    
    this.userService.createUser(formData).subscribe({
      next: (response) => {
        console.log('User created:', response);
        this.closeCreateModal();
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error creating user:', error);
      }
    });
  }

  // Edit User
  openEditModal(user: User) {
    this.selectedUser = user;
    this.showEditModal = true;
    this.editForm.patchValue({
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role
    });
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedUser = null;
    this.editForm.reset();
  }

  updateUser() {
    if (this.editForm.invalid || !this.selectedUser) return;

    const formData: UpdateUserRequest = this.editForm.value;
    
    this.userService.updateUser(this.selectedUser.id, formData).subscribe({
      next: (response) => {
        console.log('User updated:', response);
        this.closeEditModal();
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error updating user:', error);
      }
    });
  }

  // Delete User
  openDeleteModal(user: User) {
    this.selectedUser = user;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedUser = null;
  }

  deleteUser() {
    if (!this.selectedUser) return;

    this.userService.deleteUser(this.selectedUser.id).subscribe({
      next: () => {
        console.log('User deleted');
        this.closeDeleteModal();
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error deleting user:', error);
      }
    });
  }

  // Toggle User Active Status
  toggleUserActive(user: User) {
    this.userService.setUserActive(user.id, !user.is_active).subscribe({
      next: () => {
        user.is_active = !user.is_active;
        console.log(`User ${user.is_active ? 'activated' : 'deactivated'}`);
      },
      error: (error) => {
        console.error('Error updating user status:', error);
      }
    });
  }

  // Pagination
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadUsers();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadUsers();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadUsers();
  }

  // Utility methods
  getPageNumbers(): number[] {
    const pages = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  getRoleColor(role: string): string {
    return role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';
  }

  getStatusColor(isActive: boolean): string {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
}
