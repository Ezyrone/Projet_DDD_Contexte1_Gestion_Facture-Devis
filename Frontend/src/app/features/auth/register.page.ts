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
        <h1>Inscription</h1>
        <label><span>Email</span><input class="form-input" [(ngModel)]="email" name="email" /></label>
        <label><span>Username</span><input class="form-input" [(ngModel)]="username" name="username" /></label>
        <label><span>Mot de passe</span><input class="form-input" type="password" [(ngModel)]="password" name="password" /></label>
        <label><span>Confirmation mot de passe</span><input class="form-input" type="password" [(ngModel)]="confirmPassword" name="confirmPassword" /></label>
        <app-button type="submit">S’inscrire</app-button>
        <a routerLink="/login">Déjà un compte ? Se connecter</a>
      </form>
    </section>
  `,
})
export class RegisterPageComponent {
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  email = '';
  username = '';
  password = '';
  confirmPassword = '';

  submit(): void {
    if (this.password !== this.confirmPassword) {
      this.toastService.push('error', 'Les mots de passe ne correspondent pas.');
      return;
    }

    this.authService
      .register({
        email: this.email,
        username: this.username,
        password: this.password,
        confirmPassword: this.confirmPassword,
      })
      .subscribe({
        next: () => this.toastService.push('success', 'Inscription réussie. Vous pouvez vous connecter.'),
        error: () => this.toastService.push('error', 'Échec de l’inscription'),
      });
  }
}
