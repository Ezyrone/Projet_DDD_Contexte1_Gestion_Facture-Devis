import { Component } from '@angular/core';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <section class="page-header">
      <div>
        <h1>Version du devis</h1>
        <p>Consultation d'une version précise et comparaison.</p>
      </div>
      <div class="actions">
        <app-button variant="secondary">Comparer avec version précédente</app-button>
        <app-button variant="secondary">Voir historique complet</app-button>
      </div>
    </section>

    <section class="grid-two">
      <article class="card">
        <h3>Version sélectionnée</h3>
        <p>Lignes, totaux, notes et conditions figées.</p>
      </article>
      <article class="card">
        <h3>Comparaison</h3>
        <p>Lignes ajoutées, supprimées, modifiées.</p>
      </article>
    </section>
  `,
})
export class QuoteVersionPageComponent {}
