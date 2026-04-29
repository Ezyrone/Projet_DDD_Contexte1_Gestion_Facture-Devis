import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { LoadingStateComponent } from '../../shared/ui/state/loading-state.component';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { DocumentsApiService, DocumentExporteItem } from '../shared/data/documents-api.service';
import { QuotesApiService, QuoteItem } from '../quotes/data/quotes-api.service';
import { catchError, forkJoin, of } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, LoadingStateComponent],
  template: `
    <section class="page-header">
      <div>
        <h1>Export documentaire</h1>
        <p>Export devis/factures vers PDF, CSV ou Excel.</p>
      </div>
    </section>

    @if (loading()) {
      <app-loading-state />
    } @else {
      <form class="card form-grid">
        <label>
          <span>Devis à exporter</span>
          <select class="form-input" [(ngModel)]="selectedDevisId" name="devisId">
            <option value="">-- Sélectionner un devis --</option>
            @for (d of devisList(); track d.id) {
              <option [value]="d.id">{{ d.titre || d.id }}</option>
            }
          </select>
        </label>
        <label>
          <span>Format</span>
          <select class="form-input" [(ngModel)]="format" name="format">
            <option value="PDF">PDF</option>
            <option value="CSV">CSV</option>
            <option value="EXCEL">Excel</option>
          </select>
        </label>
      </form>

      <div class="actions" style="margin-top: var(--space-4)">
        <app-button (click)="doExport()">Exporter</app-button>
      </div>

      @if (exports().length > 0) {
        <article class="card" style="margin-top: var(--space-4)">
          <h3>Historique des exports</h3>
          <div class="table-wrap" style="margin-top: var(--space-3)">
            <table class="table">
              <thead>
                <tr>
                  <th>Format</th>
                  <th>Chemin</th>
                  <th>Acteur</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                @for (exp of exports(); track exp.id) {
                  <tr>
                    <td>{{ exp.format }}</td>
                    <td>{{ exp.chemin }}</td>
                    <td>{{ exp.acteur }}</td>
                    <td>{{ formatDate(exp.dateExport) }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </article>
      }
    }
  `,
})
export class DocumentsExportPageComponent implements OnInit {
  private readonly toast = inject(ToastService);
  private readonly docsApi = inject(DocumentsApiService);
  private readonly quotesApi = inject(QuotesApiService);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal(true);
  readonly devisList = signal<QuoteItem[]>([]);
  readonly exports = signal<DocumentExporteItem[]>([]);

  selectedDevisId = '';
  format = 'PDF';

  ngOnInit(): void {
    const devisIdParam = this.route.snapshot.queryParamMap.get('devisId');
    if (devisIdParam) {
      this.selectedDevisId = devisIdParam;
    }

    forkJoin({
      devis: this.quotesApi.list({}).pipe(catchError(() => of([]))),
      exports: this.docsApi.listExports().pipe(catchError(() => of([]))),
    }).subscribe(({ devis, exports }) => {
      this.devisList.set(devis);
      this.exports.set(exports);
      this.loading.set(false);
    });
  }

  doExport(): void {
    if (!this.selectedDevisId) {
      this.toast.push('error', 'Veuillez sélectionner un devis.');
      return;
    }
    this.docsApi.export(this.format, '/exports/' + this.selectedDevisId, 'USER', this.selectedDevisId).subscribe({
      next: (result) => {
        this.toast.push('success', `Export ${this.format} réussi.`);
        this.exports.update((list) => [...list, result]);
        // Déclenche le téléchargement du fichier mock généré par le backend
        // Utilisation de window.location.href pour éviter le blocage des popups (vs window.open dans un subscribe)
        window.location.href = `/documents/download/${result.id}`;
      },
      error: () => this.toast.push('error', 'Erreur lors de l\'export.'),
    });
  }

  formatDate(dateStr: string): string {
    try { return new Date(dateStr).toLocaleDateString('fr-FR'); } catch { return dateStr; }
  }
}
