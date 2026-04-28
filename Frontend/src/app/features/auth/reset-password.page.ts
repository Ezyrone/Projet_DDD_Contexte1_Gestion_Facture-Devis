import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { ToastService } from '../../shared/ui/toast/toast.service';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink, ButtonComponent],
  template: `
    <section class="auth-page">
      <form class="card auth-card" (ngSubmit)="submit()">
        <h1>Réinitialisation du mot de passe</h1>
        <p>Token : {{ token }}</p>
        <label><span>Nouveau mot de passe</span><input class="form-input" type="password" [(ngModel)]="password" name="password" /></label>
        <label><span>Confirmation</span><input class="form-input" type="password" [(ngModel)]="confirmPassword" name="confirmPassword" /></label>
        <app-button type="submit">Valider</app-button>
        <a routerLink="/login">Retour à la connexion</a>
      </form>
    </section>
  `,
})
export class ResetPasswordPageComponent {
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);

  readonly token = this.route.snapshot.paramMap.get('token');
  password = '';
  confirmPassword = '';

  submit(): void {
    if (this.password !== this.confirmPassword) {
      this.toastService.push('error', 'La confirmation ne correspond pas.');
      return;
    }

    this.toastService.push('success', 'Mot de passe réinitialisé.');
  }
}
