import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { ToastService } from '../../shared/ui/toast/toast.service';

@Component({
  standalone: true,
  imports: [FormsModule, ButtonComponent],
  template: `
    <section class="auth-page">
      <form class="card auth-card" (ngSubmit)="submit()">
        <h1>Connexion</h1>
        <p class="muted" style="font-size: 0.85rem">
          Entrez l'email d'un utilisateur existant pour vous connecter.
        </p>
        <label><span>Email</span><input class="form-input" [(ngModel)]="identifier" name="identifier" placeholder="ex: admin@test.com" /></label>
        <label><span>Mot de passe</span><input class="form-input" type="password" [(ngModel)]="password" name="password" placeholder="(n'importe quel mot de passe)" /></label>
        <app-button type="submit">Se connecter</app-button>
        <div class="card" style="background: var(--bg-page); margin-top: var(--space-2)">
          <p style="font-size: 0.8rem; font-weight: 600; margin-bottom: var(--space-2)">Comptes de test :</p>
          <p style="font-size: 0.8rem" class="muted">admin&#64;test.com — Admin/Finance</p>
          <p style="font-size: 0.8rem" class="muted">ali&#64;test.com — Client</p>
          <p style="font-size: 0.8rem" class="muted">sara&#64;test.com — Comptable/Finance</p>
        </div>
      </form>
    </section>
  `,
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  identifier = '';
  password = '';

  submit(): void {
    if (!this.identifier.trim()) {
      this.toastService.push('error', 'Veuillez entrer un email.');
      return;
    }
    this.authService.login({ identifier: this.identifier, password: this.password }).subscribe({
      next: () => this.toastService.push('success', 'Connexion réussie'),
      error: () => this.toastService.push('error', 'Utilisateur introuvable. Vérifiez l\'email.'),
    });
  }
}
