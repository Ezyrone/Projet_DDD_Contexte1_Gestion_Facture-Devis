import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { LoadingStateComponent } from '../../shared/ui/state/loading-state.component';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { DocumentsApiService, ImportDocumentItem } from '../shared/data/documents-api.service';
import { catchError, of } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, LoadingStateComponent],
  template: `
    <section class="page-header">
      <div>
        <h1>Import documentaire</h1>
        <p>Import devis/factures depuis Excel avec validations métier.</p>
      </div>
    </section>

    @if (loading()) {
      <app-loading-state />
    } @else {
      <section class="card form-grid">
        <label>
          <span>Chemin du fichier à importer</span>
          <input class="form-input" [(ngModel)]="fichierPath" name="fichier" placeholder="ex: /imports/devis.xlsx" />
        </label>
      </section>

      <div class="actions" style="margin-top: var(--space-4)">
        <app-button (click)="doImport()">Importer</app-button>
      </div>

      @if (lastImport()) {
        <article class="card" style="margin-top: var(--space-4)">
          <h3>Résultat d'import</h3>
          <p>Succès : {{ lastImport()!.succes ? 'Oui' : 'Non' }}</p>
          @if (lastImport()!.erreurs.length > 0) {
            <p style="color: var(--danger)">Erreurs :</p>
            <ul>
              @for (err of lastImport()!.erreurs; track err) {
                <li>{{ err }}</li>
              }
            </ul>
          }
          @if (lastImport()!.devisId) {
            <p>Devis créé : {{ lastImport()!.devisId }}</p>
          }
        </article>
      }

      @if (importHistory().length > 0) {
        <article class="card" style="margin-top: var(--space-4)">
          <h3>Historique des imports</h3>
          <div class="table-wrap" style="margin-top: var(--space-3)">
            <table class="table">
              <thead>
                <tr>
                  <th>Fichier</th>
                  <th>Succès</th>
                  <th>Erreurs</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                @for (imp of importHistory(); track imp.id) {
                  <tr>
                    <td>{{ imp.fichierSource }}</td>
                    <td>{{ imp.succes ? '✓' : '✗' }}</td>
                    <td>{{ imp.erreurs.length }}</td>
                    <td>{{ formatDate(imp.dateImport) }}</td>
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
export class DocumentsImportPageComponent implements OnInit {
  private readonly toast = inject(ToastService);
  private readonly docsApi = inject(DocumentsApiService);

  readonly loading = signal(true);
  readonly lastImport = signal<ImportDocumentItem | null>(null);
  readonly importHistory = signal<ImportDocumentItem[]>([]);

  fichierPath = '';

  ngOnInit(): void {
    this.docsApi.listImports().pipe(
      catchError(() => of([]))
    ).subscribe((imports) => {
      this.importHistory.set(imports);
      this.loading.set(false);
    });
  }

  doImport(): void {
    if (!this.fichierPath.trim()) {
      this.toast.push('error', 'Veuillez spécifier un chemin de fichier.');
      return;
    }
    this.docsApi.import(this.fichierPath).subscribe({
      next: (result) => {
        this.lastImport.set(result);
        this.importHistory.update((list) => [...list, result]);
        this.toast.push(result.succes ? 'success' : 'error', result.succes ? 'Import réussi.' : 'Import échoué.');
      },
      error: () => this.toast.push('error', 'Erreur lors de l\'import.'),
    });
  }

  formatDate(dateStr: string): string {
    try { return new Date(dateStr).toLocaleDateString('fr-FR'); } catch { return dateStr; }
  }
}
