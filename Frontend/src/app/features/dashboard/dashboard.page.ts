import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { LoadingStateComponent } from '../../shared/ui/state/loading-state.component';
import { QuotesApiService, QuoteItem } from '../quotes/data/quotes-api.service';
import { AvoirsApiService } from '../shared/data/avoirs-api.service';
import { AuditApiService } from '../audit/data/audit-api.service';
import { catchError, forkJoin, of } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, ButtonComponent, LoadingStateComponent],
  template: `
    <section class="page-header">
      <div>
        <h1>Tableau de bord</h1>
        <p>Vue synthétique des devis, factures et paiements selon rôle.</p>
      </div>
    </section>

    @if (loading()) {
      <app-loading-state />
    } @else {
      <section class="grid-three">
        <article class="card dashboard-card">
          <h3>Devis brouillons</h3>
          <p class="metric">{{ brouillonsCount() }}</p>
        </article>
        <article class="card dashboard-card">
          <h3>Devis envoyés</h3>
          <p class="metric">{{ envoyesCount() }}</p>
        </article>
        <article class="card dashboard-card">
          <h3>Devis approuvés</h3>
          <p class="metric">{{ approuvesCount() }}</p>
        </article>
        <article class="card dashboard-card">
          <h3>Avoirs disponibles</h3>
          <p class="metric">{{ avoirsCount() }}</p>
        </article>
        <article class="card dashboard-card">
          <h3>Événements d'audit</h3>
          <p class="metric">{{ auditCount() }}</p>
        </article>
        <article class="card dashboard-card">
          <h3>Total devis</h3>
          <p class="metric">{{ totalDevis() }}</p>
        </article>
      </section>

      @if (recentDevis().length > 0) {
        <section class="card" style="margin-top: var(--space-4)">
          <h3>Derniers devis</h3>
          <div class="table-wrap" style="margin-top: var(--space-3)">
            <table class="table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Statut</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                @for (d of recentDevis(); track d.id) {
                  <tr style="cursor:pointer" (click)="goToDevis(d.id)">
                    <td>{{ d.titre || 'Sans titre' }}</td>
                    <td>{{ formatStatut(d.statut) }}</td>
                    <td>{{ formatDate(d.dateCreation) }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </section>
      }

      <div class="actions" style="margin-top: var(--space-4)">
        <app-button (click)="goToNewQuote()">Créer un devis</app-button>
        <app-button variant="secondary" (click)="goToQuotes()">Voir tous les devis</app-button>
        <app-button variant="secondary" (click)="goToAudit()">Journal d'audit</app-button>
      </div>
    }
  `,
  styles: [`
    .dashboard-card { text-align: center; }
    .metric { font-size: 2rem; font-weight: 800; color: var(--accent); margin-top: var(--space-2); }
  `],
})
export class DashboardPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly quotesApi = inject(QuotesApiService);
  private readonly avoirsApi = inject(AvoirsApiService);
  private readonly auditApi = inject(AuditApiService);

  readonly loading = signal(true);
  readonly brouillonsCount = signal(0);
  readonly envoyesCount = signal(0);
  readonly approuvesCount = signal(0);
  readonly avoirsCount = signal(0);
  readonly auditCount = signal(0);
  readonly totalDevis = signal(0);
  readonly recentDevis = signal<QuoteItem[]>([]);

  ngOnInit(): void {
    forkJoin({
      devis: this.quotesApi.list({}).pipe(catchError(() => of([]))),
      avoirs: this.avoirsApi.list().pipe(catchError(() => of([]))),
      audit: this.auditApi.list({}).pipe(catchError(() => of([]))),
    }).subscribe(({ devis, avoirs, audit }) => {
      this.totalDevis.set(devis.length);
      this.brouillonsCount.set(devis.filter((d) => d.statut === 'BROUILLON').length);
      this.envoyesCount.set(devis.filter((d) => d.statut === 'ENVOYE').length);
      this.approuvesCount.set(devis.filter((d) => d.statut === 'APPROUVE').length);
      this.avoirsCount.set(avoirs.filter((a) => a.statut === 'DISPONIBLE').length);
      this.auditCount.set(audit.length);
      this.recentDevis.set(devis.slice(0, 5));
      this.loading.set(false);
    });
  }

  formatStatut(statut: string): string {
    const map: Record<string, string> = {
      BROUILLON: 'Brouillon', ENVOYE: 'Envoyé', EN_NEGOCIATION: 'En négociation',
      APPROUVE: 'Approuvé', REFUSE: 'Refusé', EXPIRE: 'Expiré',
    };
    return map[statut] ?? statut;
  }

  formatDate(dateStr: string): string {
    try { return new Date(dateStr).toLocaleDateString('fr-FR'); } catch { return dateStr; }
  }

  goToNewQuote(): void { void this.router.navigate(['/quotes/new']); }
  goToQuotes(): void { void this.router.navigate(['/quotes']); }
  goToAudit(): void { void this.router.navigate(['/audit']); }
  goToDevis(id: string): void { void this.router.navigate(['/quotes', id]); }
}
