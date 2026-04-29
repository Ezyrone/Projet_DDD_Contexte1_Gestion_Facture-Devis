import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { LoginCredentials, RegisterPayload, UserProfile } from './auth.types';

/**
 * Service d'authentification simplifié.
 * Le backend ne dispose pas d'endpoints /auth — on s'appuie sur
 * la liste des utilisateurs chargés dans le Shared Kernel (/users)
 * et on stocke l'utilisateur sélectionné dans localStorage.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly STORAGE_KEY = 'ff_current_user';

  readonly currentUser = signal<UserProfile | null>(null);
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  /**
   * Connexion simplifiée : on recherche l'utilisateur par email parmi
   * les utilisateurs du backend.
   */
  login(credentials: LoginCredentials): Observable<UserProfile> {
    return this.http.get<any[]>('/users').pipe(
      map((users) => {
        const found = users.find(
          (u) =>
            u.email === credentials.identifier ||
            u.nom === credentials.identifier ||
            u.prenom === credentials.identifier
        );
        if (!found) {
          throw new Error('Utilisateur introuvable');
        }
        const profile = this.mapToProfile(found);
        this.currentUser.set(profile);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profile));
        void this.router.navigate(['/dashboard']);
        return profile;
      })
    );
  }

  register(_payload: RegisterPayload): Observable<void> {
    // Pas de vrai register côté backend — on simule
    return of(void 0);
  }

  logout(navigateToLogin = true): Observable<void> {
    this.clearSession();
    if (navigateToLogin) {
      void this.router.navigate(['/login']);
    }
    return of(void 0);
  }

  refreshToken(): Observable<void> {
    return of(void 0);
  }

  me(): Observable<UserProfile> {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const profile = JSON.parse(stored) as UserProfile;
      this.currentUser.set(profile);
      return of(profile);
    }
    throw new Error('No session');
  }

  restoreSession(): Observable<void> {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const profile = JSON.parse(stored) as UserProfile;
        this.currentUser.set(profile);
      } catch {
        this.clearSession();
      }
    }
    return of(void 0);
  }

  clearSession(): void {
    this.currentUser.set(null);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Mappe un User backend vers un UserProfile frontend.
   */
  private mapToProfile(backendUser: any): UserProfile {
    const typeMapping: Record<string, 'COMMERCIAL' | 'FINANCE' | 'CLIENT'> = {
      ADMIN: 'FINANCE',
      COMPTABLE: 'FINANCE',
      COMMERCIAL: 'COMMERCIAL',
      CLIENT: 'CLIENT',
    };
    return {
      id: backendUser.id,
      username: `${backendUser.prenom} ${backendUser.nom}`,
      email: backendUser.email,
      role: typeMapping[backendUser.type] ?? 'CLIENT',
    };
  }
}
