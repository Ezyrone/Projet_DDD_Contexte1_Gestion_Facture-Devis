import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/ui/button/button.component';

@Component({
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  template: `
    <section class="auth-page">
      <article class="card auth-card">
        <h1>403 - Accès interdit</h1>
        <p>Vous n'avez pas la permission d'accéder à cette ressource.</p>
        <a routerLink="/dashboard"><app-button>Retour au tableau de bord</app-button></a>
      </article>
    </section>
  `,
})
export class ForbiddenPageComponent {}
