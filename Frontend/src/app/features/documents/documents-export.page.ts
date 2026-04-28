import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  standalone: true,
  imports: [FormsModule, ButtonComponent],
  template: `
    <section class="page-header">
      <div>
        <h1>Export documentaire</h1>
        <p>Export devis/factures vers PDF, CSV ou Excel.</p>
      </div>
    </section>

    <form class="card form-grid">
      <label>
        <span>Type de document</span>
        <select class="form-input">
          <option>Devis</option>
          <option>Facture</option>
        </select>
      </label>
      <label>
        <span>Format</span>
        <select class="form-input">
          <option>PDF</option>
          <option>CSV</option>
          <option>Excel</option>
        </select>
      </label>
    </form>

    <div class="actions">
      <app-button>Exporter</app-button>
      <app-button variant="secondary">Télécharger</app-button>
    </div>
  `,
})
export class DocumentsExportPageComponent {}
