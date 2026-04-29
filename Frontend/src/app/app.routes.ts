import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'login', loadComponent: () => import('./features/auth/login.page').then((m) => m.LoginPageComponent) },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register.page').then((m) => m.RegisterPageComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/auth/forgot-password.page').then((m) => m.ForgotPasswordPageComponent),
  },
  {
    path: 'reset-password/:token',
    loadComponent: () => import('./features/auth/reset-password.page').then((m) => m.ResetPasswordPageComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./core/layout/app-shell.component').then((m) => m.AppShellComponent),
    children: [
      {
        path: 'dashboard',
        canActivate: [roleGuard],
        data: { roles: ['COMMERCIAL', 'FINANCE', 'CLIENT'] },
        loadComponent: () => import('./features/dashboard/dashboard.page').then((m) => m.DashboardPageComponent),
      },
      {
        path: 'quotes',
        canActivate: [roleGuard],
        data: { roles: ['COMMERCIAL', 'CLIENT', 'FINANCE'], resource: 'quotes' },
        loadComponent: () => import('./features/shared/resource-list.page').then((m) => m.ResourceListPageComponent),
      },
      {
        path: 'quotes/new',
        canActivate: [roleGuard],
        data: { roles: ['COMMERCIAL', 'FINANCE'], mode: 'create' },
        loadComponent: () => import('./features/quotes/quote-form.page').then((m) => m.QuoteFormPageComponent),
      },
      {
        path: 'quotes/:id/edit',
        canActivate: [roleGuard],
        data: { roles: ['COMMERCIAL', 'FINANCE'], mode: 'edit' },
        loadComponent: () => import('./features/quotes/quote-form.page').then((m) => m.QuoteFormPageComponent),
      },
      {
        path: 'quotes/:id',
        canActivate: [roleGuard],
        data: { roles: ['COMMERCIAL', 'CLIENT', 'FINANCE'], resource: 'quote' },
        loadComponent: () => import('./features/shared/resource-detail.page').then((m) => m.ResourceDetailPageComponent),
      },
      {
        path: 'quotes/:id/versions/:versionId',
        canActivate: [roleGuard],
        data: { roles: ['COMMERCIAL', 'CLIENT', 'FINANCE'] },
        loadComponent: () => import('./features/quotes/quote-version.page').then((m) => m.QuoteVersionPageComponent),
      },
      {
        path: 'invoices',
        canActivate: [roleGuard],
        data: { roles: ['FINANCE', 'CLIENT'], resource: 'invoices' },
        loadComponent: () => import('./features/shared/resource-list.page').then((m) => m.ResourceListPageComponent),
      },
      {
        path: 'invoices/:id',
        canActivate: [roleGuard],
        data: { roles: ['FINANCE', 'CLIENT'], resource: 'invoice' },
        loadComponent: () => import('./features/shared/resource-detail.page').then((m) => m.ResourceDetailPageComponent),
      },
      {
        path: 'payments',
        canActivate: [roleGuard],
        data: { roles: ['FINANCE', 'CLIENT'], resource: 'payments' },
        loadComponent: () => import('./features/shared/resource-list.page').then((m) => m.ResourceListPageComponent),
      },
      {
        path: 'collections',
        canActivate: [roleGuard],
        data: { roles: ['FINANCE'], resource: 'collections' },
        loadComponent: () => import('./features/shared/resource-list.page').then((m) => m.ResourceListPageComponent),
      },
      {
        path: 'credits',
        canActivate: [roleGuard],
        data: { roles: ['FINANCE'], resource: 'credits' },
        loadComponent: () => import('./features/shared/resource-list.page').then((m) => m.ResourceListPageComponent),
      },
      {
        path: 'credits/:id',
        canActivate: [roleGuard],
        data: { roles: ['FINANCE'], resource: 'credit' },
        loadComponent: () => import('./features/shared/resource-detail.page').then((m) => m.ResourceDetailPageComponent),
      },
      {
        path: 'documents/import',
        canActivate: [roleGuard],
        data: { roles: ['COMMERCIAL', 'FINANCE'] },
        loadComponent: () =>
          import('./features/documents/documents-import.page').then((m) => m.DocumentsImportPageComponent),
      },
      {
        path: 'documents/export',
        canActivate: [roleGuard],
        data: { roles: ['COMMERCIAL', 'FINANCE'] },
        loadComponent: () =>
          import('./features/documents/documents-export.page').then((m) => m.DocumentsExportPageComponent),
      },
      {
        path: 'notifications',
        canActivate: [roleGuard],
        data: { roles: ['COMMERCIAL', 'FINANCE'], resource: 'notifications' },
        loadComponent: () => import('./features/shared/resource-list.page').then((m) => m.ResourceListPageComponent),
      },
      {
        path: 'audit',
        canActivate: [roleGuard],
        data: { roles: ['COMMERCIAL', 'FINANCE'], resource: 'audit' },
        loadComponent: () => import('./features/shared/resource-list.page').then((m) => m.ResourceListPageComponent),
      },
      {
        path: 'audit/:id',
        canActivate: [roleGuard],
        data: { roles: ['COMMERCIAL', 'FINANCE'], resource: 'audit' },
        loadComponent: () => import('./features/shared/resource-detail.page').then((m) => m.ResourceDetailPageComponent),
      },
      {
        path: 'profile',
        canActivate: [roleGuard],
        data: { roles: ['COMMERCIAL', 'FINANCE', 'CLIENT'] },
        loadComponent: () => import('./features/profile/profile.page').then((m) => m.ProfilePageComponent),
      },
    ],
  },
  {
    path: '403',
    loadComponent: () =>
      import('./features/system/forbidden/forbidden.page').then((m) => m.ForbiddenPageComponent),
  },
  {
    path: '500',
    loadComponent: () =>
      import('./features/system/server-error/server-error.page').then((m) => m.ServerErrorPageComponent),
  },
  {
    path: '404',
    loadComponent: () => import('./features/system/not-found/not-found.page').then((m) => m.NotFoundPageComponent),
  },
  { path: '**', redirectTo: '/404' },
];
