import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { ToastService } from '../../shared/ui/toast/toast.service';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink, ButtonComponent],
  template: `
    <section class="auth-page">
      <form class="card auth-card" (ngSubmit)="submit()">
        <h1>Connexion</h1>
        <label><span>Email ou username</span><input class="form-input" [(ngModel)]="identifier" name="identifier" /></label>
        <label><span>Mot de passe</span><input class="form-input" type="password" [(ngModel)]="password" name="password" /></label>
        <app-button type="submit">Se connecter</app-button>
        <a routerLink="/register">Créer un compte</a>
        <a routerLink="/forgot-password">Mot de passe oublié ?</a>
      </form>
    </section>
  `,
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  identifier = '';
  password = '';

  submit(): void {
    this.authService.login({ identifier: this.identifier, password: this.password }).subscribe({
      next: () => this.toastService.push('success', 'Connexion réussie'),
      error: () => this.toastService.push('error', 'Identifiants invalides'),
    });
  }
}
