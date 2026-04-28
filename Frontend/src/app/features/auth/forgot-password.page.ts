import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { ToastService } from '../../shared/ui/toast/toast.service';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink, ButtonComponent],
  template: `
    <section class="auth-page">
      <form class="card auth-card" (ngSubmit)="submit()">
        <h1>Mot de passe oublié</h1>
        <label><span>Email</span><input class="form-input" [(ngModel)]="email" name="email" /></label>
        <app-button type="submit">Envoyer le lien de réinitialisation</app-button>
        <a routerLink="/login">Retour à la connexion</a>
      </form>
    </section>
  `,
})
export class ForgotPasswordPageComponent {
  private readonly toastService = inject(ToastService);
  email = '';

  submit(): void {
    this.toastService.push('info', `Si le compte existe, un email sera envoyé à ${this.email}`);
  }
}
