import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { 
    path: 'home', 
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  { 
    path: 'programs', 
    loadComponent: () => import('./pages/programs/programs.component').then(m => m.ProgramsComponent)
  },
  { 
    path: 'activities', 
    loadComponent: () => import('./pages/activities/activities.component').then(m => m.ActivitiesComponent)
  },
  { 
    path: 'about', 
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
  },
  { 
    path: 'contact', 
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent)
  },
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'register', 
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  { 
    path: 'auth', 
    loadComponent: () => import('./pages/auth/auth.component').then(m => m.AuthComponent)
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [
      { path: '', redirectTo: 'welcome', pathMatch: 'full' },
      { 
        path: 'welcome', 
        loadComponent: () => import('./pages/dashboard/welcome/welcome.component').then(m => m.WelcomeComponent)
      },
      { 
        path: 'users', 
        loadComponent: () => import('./pages/dashboard/user-list/user-list.component').then(m => m.UserListComponent)
      },
      { 
        path: 'children', 
        loadComponent: () => import('./pages/dashboard/children/children.component').then(m => m.ChildrenComponent)
      },
      { 
        path: 'profile', 
        loadComponent: () => import('./pages/dashboard/profile-edit/profile-edit.component').then(m => m.ProfileEditComponent)
      },
      { 
        path: 'activities', 
        loadComponent: () => import('./pages/dashboard/activities/activities.component').then(m => m.ActivitiesComponent)
      },
      { 
        path: 'design-template', 
        loadComponent: () => import('./pages/dashboard/design-template/design-template.component').then(m => m.DesignTemplateComponent),
        canActivate: [() => {
          const authService = inject(AuthService);
          const router = inject(Router);
          const user = authService.currentUserValue;
          if (user?.role === 'admin') {
            return true;
          } else {
            router.navigate(['/dashboard']);
            return false;
          }
        }]
      }
    ]
  },
  { path: '**', redirectTo: '/home' }
];
