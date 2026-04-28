import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/ui/button/button.component';

@Component({
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  template: `
    <section class="auth-page">
      <article class="card auth-card">
        <h1>Erreur serveur</h1>
        <p>Le backend est momentanément indisponible.</p>
        <a routerLink="/dashboard"><app-button variant="secondary">Réessayer</app-button></a>
      </article>
    </section>
  `,
})
export class ServerErrorPageComponent {}
