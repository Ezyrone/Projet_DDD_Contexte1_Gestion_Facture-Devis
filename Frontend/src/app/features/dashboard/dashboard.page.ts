import { Component } from '@angular/core';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <section class="page-header">
      <div>
        <h1>Tableau de bord</h1>
        <p>Vue synthétique des devis, factures et paiements selon rôle.</p>
      </div>
    </section>

    <section class="grid-three">
      <article class="card"><h3>Devis brouillons</h3><p>12</p></article>
      <article class="card"><h3>Factures en retard</h3><p>3</p></article>
      <article class="card"><h3>Relances à envoyer</h3><p>5</p></article>
    </section>

    <div class="actions">
      <app-button>Créer un devis</app-button>
      <app-button variant="secondary">Enregistrer un paiement</app-button>
      <app-button variant="secondary">Lancer une relance</app-button>
    </div>
  `,
})
export class DashboardPageComponent {}
