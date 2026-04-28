import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <section class="page-header">
      <div>
        <h1>{{ modeTitle() }}</h1>
        <p>Gestion des lignes, notes et conditions spécifiques.</p>
      </div>
    </section>

    <form class="card form-grid">
      <label><span>Titre</span><input class="form-input" required /></label>
      <label><span>Client</span><input class="form-input" required /></label>
      <label class="full"><span>Notes client</span><textarea class="form-input"></textarea></label>
      <label class="full"><span>Conditions spécifiques</span><textarea class="form-input"></textarea></label>
    </form>

    <article class="card">
      <h3>Lignes de devis</h3>
      <p>Produit/Service, quantité, prix unitaire, remise, TVA, total ligne, total devis.</p>
      <div class="actions">
        <app-button variant="secondary">Ajouter une ligne</app-button>
        <app-button variant="danger">Supprimer ligne</app-button>
      </div>
    </article>

    <div class="actions">
      <app-button variant="secondary">Enregistrer brouillon</app-button>
      <app-button>Envoyer</app-button>
    </div>
  `,
})
export class QuoteFormPageComponent {
  private readonly route = inject(ActivatedRoute);
  readonly modeTitle = computed(() =>
    this.route.snapshot.data['mode'] === 'edit' ? 'Édition du devis' : 'Création d’un devis',
  );
}
