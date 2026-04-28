import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonComponent } from '../../shared/ui/button/button.component';

const DETAIL_CONTENT: Record<string, { title: string; sections: string[]; actions: string[] }> = {
  quote: {
    title: 'Détail du devis',
    sections: ['Récap client', 'Lignes et totaux', 'Notes et conditions', 'Historique des événements'],
    actions: ['Modifier', 'Envoyer', 'Approuver', 'Refuser'],
  },
  invoice: {
    title: 'Détail de la facture',
    sections: ['Lignes et totaux', 'Historique des statuts', 'Échéance', 'Paiements associés'],
    actions: ['Marquer prestation réalisée', 'Générer avenant', 'Annuler', 'Exporter'],
  },
  credit: {
    title: "Détail de l'avoir",
    sections: ['Origine', "Journal d'actions", 'Compensations et remboursements'],
    actions: ['Compensation', 'Remboursement'],
  },
  audit: {
    title: "Détail d'événement d'audit",
    sections: ['Payload', 'Acteur', 'Horodatage', 'Objet métier concerné'],
    actions: ['Exporter'],
  },
};

@Component({
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <section class="page-header">
      <div>
        <h1>{{ content().title }}</h1>
        <p>ID: {{ id() }}</p>
      </div>
      <div class="actions">
        @for (action of content().actions; track action) {
          <app-button [variant]="action.includes('Annuler') || action.includes('Refuser') ? 'danger' : 'secondary'">
            {{ action }}
          </app-button>
        }
      </div>
    </section>

    <section class="grid-two">
      @for (section of content().sections; track section) {
        <article class="card">
          <h3>{{ section }}</h3>
          <p>Données métiers présentées ici via API.</p>
        </article>
      }
    </section>
  `,
})
export class ResourceDetailPageComponent {
  private readonly route = inject(ActivatedRoute);

  readonly id = computed(() => this.route.snapshot.paramMap.get('id') ?? 'N/A');
  readonly content = computed(() => {
    const key = this.route.snapshot.data['resource'] as string;
    return DETAIL_CONTENT[key];
  });
}
