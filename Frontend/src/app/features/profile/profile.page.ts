import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  standalone: true,
  imports: [FormsModule, ButtonComponent],
  template: `
    <section class="page-header">
      <div>
        <h1>Profil</h1>
        <p>Préférences et gestion du compte.</p>
      </div>
    </section>

    <form class="card form-grid">
      <label><span>Email</span><input class="form-input" [value]="user()?.email ?? ''" readonly /></label>
      <label><span>Nom</span><input class="form-input" [value]="user()?.username ?? ''" readonly /></label>
      <label><span>Rôle</span><input class="form-input" [value]="user()?.role ?? ''" readonly /></label>
      <label><span>ID</span><input class="form-input" [value]="user()?.id ?? ''" readonly /></label>
    </form>

    <div class="actions" style="margin-top: var(--space-4)">
      <app-button variant="danger" (click)="logout()">Se déconnecter</app-button>
    </div>
  `,
})
export class ProfilePageComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly user = computed(() => this.auth.currentUser());

  logout(): void {
    this.auth.logout().subscribe();
  }
}
