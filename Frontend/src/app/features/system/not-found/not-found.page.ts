import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/ui/button/button.component';

@Component({
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  template: `
    <section class="auth-page">
      <article class="card auth-card">
        <h1>404 - Page introuvable</h1>
        <p>La page demandée n'existe pas.</p>
        <a routerLink="/dashboard"><app-button>Retour à l’accueil</app-button></a>
      </article>
    </section>
  `,
})
export class NotFoundPageComponent {}
