import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';

interface NavLink {
  label: string;
  to: string;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell">
      <header class="app-header card">
        <div class="logo">FactureFlow</div>
        <input class="form-input search-input" placeholder="Rechercher devis / factures..." />
        <button class="btn btn-ghost" type="button">Notifications</button>
        <div class="profile-menu">
          <span class="muted">{{ auth.currentUser()?.username }}</span>
          <button class="btn btn-secondary" type="button" (click)="logout()">Se deconnecter</button>
        </div>
      </header>

      <div class="app-body">
        <aside class="sidebar card">
          <nav>
            @for (link of navigation(); track link.to) {
              <a
                [routerLink]="link.to"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: link.to === '/dashboard' }"
              >
                {{ link.label }}
              </a>
            }
          </nav>
        </aside>

        <main class="content-area">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class AppShellComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly navigation = computed<NavLink[]>(() => {
    const role = this.auth.currentUser()?.role;
    const common: NavLink[] = [
      { label: 'Tableau de bord', to: '/dashboard' },
      { label: 'Import / Export', to: '/documents/import' },
      { label: 'Traçabilité', to: '/audit' },
    ];

    if (role === 'COMMERCIAL') {
      return [...common, { label: 'Devis', to: '/quotes' }];
    }

    if (role === 'FINANCE') {
      return [
        ...common,
        { label: 'Factures', to: '/invoices' },
        { label: 'Paiements', to: '/payments' },
        { label: 'Relances', to: '/collections' },
        { label: 'Avoirs', to: '/credits' },
      ];
    }

    return [
      { label: 'Mes devis', to: '/quotes' },
      { label: 'Mes factures', to: '/invoices' },
      { label: 'Paiements', to: '/payments' },
      { label: 'Profil', to: '/profile' },
    ];
  });

  logout(): void {
    this.auth.logout().subscribe();
    void this.router.navigate(['/login']);
  }
}
