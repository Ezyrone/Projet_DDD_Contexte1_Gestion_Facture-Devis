import { Component } from '@angular/core';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <section class="page-header">
      <div>
        <h1>Import documentaire</h1>
        <p>Import devis/factures depuis Excel avec validations métier.</p>
      </div>
    </section>

    <section class="card form-grid">
      <label><span>Import devis (Excel)</span><input class="form-input" type="file" /></label>
      <label><span>Import facture (Excel)</span><input class="form-input" type="file" /></label>
    </section>

    <div class="actions">
      <app-button variant="secondary">Télécharger modèle</app-button>
      <app-button>Importer</app-button>
    </div>

    <article class="card">
      <h3>Résultat d'import</h3>
      <p>Lignes traitées: 0 | Acceptées: 0 | Rejetées: 0</p>
      <app-button variant="ghost">Télécharger rapport d'erreurs</app-button>
    </article>
  `,
})
export class DocumentsImportPageComponent {}
