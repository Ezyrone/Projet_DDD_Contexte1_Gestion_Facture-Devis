import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { LoginCredentials, RegisterPayload, UserProfile } from './auth.types';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly authBaseUrl = '/auth';

  readonly currentUser = signal<UserProfile | null>(null);
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  login(credentials: LoginCredentials): Observable<UserProfile> {
    return this.http.post<void>(`${this.authBaseUrl}/login`, credentials).pipe(switchMap(() => this.me()));
  }

  register(payload: RegisterPayload): Observable<void> {
    return this.http.post<void>(`${this.authBaseUrl}/register`, payload);
  }

  logout(navigateToLogin = true): Observable<void> {
    return this.http.post<void>(`${this.authBaseUrl}/logout`, {}).pipe(
      catchError(() => of(void 0)),
      tap(() => {
        this.clearSession();
        if (navigateToLogin) {
          void this.router.navigate(['/login']);
        }
      }),
    );
  }

  refreshToken(): Observable<void> {
    return this.http.post<void>(`${this.authBaseUrl}/refresh`, {});
  }

  me(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.authBaseUrl}/me`).pipe(tap((user) => this.currentUser.set(user)));
  }

  restoreSession(): Observable<void> {
    return this.me().pipe(
      map(() => void 0),
      catchError(() => {
        this.clearSession();
        return of(void 0);
      }),
    );
  }

  clearSession(): void {
    this.currentUser.set(null);
  }
}
