import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { FrontendEmailService } from '../../core/notification/frontend-email.service';
import { ConfirmService } from '../../shared/ui/confirm/confirm.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { EmptyStateComponent } from '../../shared/ui/state/empty-state.component';
import { LoadingStateComponent } from '../../shared/ui/state/loading-state.component';
import { ErrorStateComponent } from '../../shared/ui/state/error-state.component';
import { TableComponent } from '../../shared/ui/table/table.component';
import { ToastService } from '../../shared/ui/toast/toast.service';

import { QuotesApiService } from '../quotes/data/quotes-api.service';
import type { QuoteItem } from '../quotes/data/quotes-api.service';
import { AuditStore } from '../audit/data/audit.store';
import { AvoirsApiService, AvoirItem } from './data/avoirs-api.service';
import { PaiementsApiService } from './data/paiements-api.service';
import { UsersApiService, UserItem } from './data/users-api.service';
import { InvoicesApiService, InvoiceItem } from '../invoices/data/invoices-api.service';
import { LIST_PAGE_CONFIG, ListPageConfig } from './page-config';
import { catchError, forkJoin, of } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, EmptyStateComponent, LoadingStateComponent, ErrorStateComponent, TableComponent],
  template: `
    <section class="page-header">
      <div>
        <h1>{{ config().title }}</h1>
        <p>{{ config().subtitle }}</p>
      </div>
      <div class="actions">
        @for (action of roleActions(); track action.label) {
          <app-button [variant]="action.variant ?? 'primary'" type="button" (click)="onAction(action.label)">
            {{ action.label }}
          </app-button>
        }
      </div>
    </section>

    <section class="card filter-bar">
      <label>
        <span>Recherche</span>
        <input
          class="form-input"
          [ngModel]="search"
          (ngModelChange)="updateFilter('search', $event)"
          placeholder="Rechercher..."
        />
      </label>
      @for (filter of config().filters; track filter) {
        <label>
          <span>{{ filter }}</span>
          <input
            class="form-input"
            [ngModel]="getQueryValue(filter)"
            (ngModelChange)="updateFilter(filter, $event)"
            [placeholder]="'Filtrer par ' + filter.toLowerCase()"
          />
        </label>
      }
    </section>

    @if (loading()) {
      <app-loading-state />
    } @else if (errorMsg()) {
      <app-error-state [description]="errorMsg()!" (retry)="loadData()" />
    } @else if (rows().length === 0) {
      <app-empty-state [title]="'Aucun résultat'" [description]="'Aucun élément trouvé.'">
        <app-button>{{ config().emptyActionLabel }}</app-button>
      </app-empty-state>
    } @else {
      <app-table [headers]="config().headers">
        @for (row of rows(); track row[0]) {
          <tr (click)="onRowClick(row)" style="cursor:pointer">
            @for (col of row; track $index) {
              <td>{{ col }}</td>
            }
          </tr>
        }
      </app-table>
    }
  `,
})
export class ResourceListPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly confirm = inject(ConfirmService);
  private readonly emailService = inject(FrontendEmailService);
  private readonly toast = inject(ToastService);

  private readonly quotesApi = inject(QuotesApiService);
  private readonly auditStore = inject(AuditStore);
  private readonly avoirsApi = inject(AvoirsApiService);
  private readonly paiementsApi = inject(PaiementsApiService);
  private readonly usersApi = inject(UsersApiService);
  private readonly invoicesApi = inject(InvoicesApiService);

  readonly search = this.route.snapshot.queryParamMap.get('search') ?? '';
  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly rows = signal<string[][]>([]);
  private usersMap = new Map<string, UserItem>();
  private rawItemIds: string[] = [];

  readonly config = computed(() => {
    const key = this.route.snapshot.data['resource'] as string;
    return LIST_PAGE_CONFIG[key];
  });

  readonly roleActions = computed(() => {
    const role = this.auth.currentUser()?.role ?? 'CLIENT';
    return this.config().actions[role] ?? [];
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const resource = this.route.snapshot.data['resource'] as string;
    this.loading.set(true);
    this.errorMsg.set(null);

    // Load users first for name resolution, then load resource data
    this.usersApi.getAll().pipe(
      catchError(() => of([]))
    ).subscribe((users) => {
      this.usersMap.clear();
      users.forEach((u) => this.usersMap.set(u.id, u));
      this.loadResourceData(resource);
    });
  }

  private loadResourceData(resource: string): void {
    switch (resource) {
      case 'quotes':
        this.quotesApi.list({}).pipe(
          catchError(() => { this.errorMsg.set('Impossible de charger les devis.'); return of([]); }),
        ).subscribe((items) => {
          this.rawItemIds = items.map((i) => i.id);
          this.rows.set(items.map((d) => this.mapDevisRow(d)));
          this.loading.set(false);
        });
        break;

      case 'credits':
        this.avoirsApi.list().pipe(
          catchError(() => { this.errorMsg.set('Impossible de charger les avoirs.'); return of([]); }),
        ).subscribe((items) => {
          this.rawItemIds = items.map((i) => i.id);
          this.rows.set(items.map((a) => this.mapAvoirRow(a)));
          this.loading.set(false);
        });
        break;

      case 'audit':
        this.auditStore.load({});
        // Subscribe to audit store changes
        const checkAudit = setInterval(() => {
          if (!this.auditStore.loading()) {
            clearInterval(checkAudit);
            const items = this.auditStore.items();
            this.rawItemIds = items.map((i) => i.id);
            this.rows.set(items.map((e) => [
              e.type,
              e.documentId ?? '-',
              e.acteur ?? 'SYSTEME',
              this.formatDate(e.horodatage),
              'Voir détail',
            ]));
            this.loading.set(false);
          }
        }, 100);
        break;

      case 'invoices':
        forkJoin({
          invoices: this.invoicesApi.list({ search: this.search }).pipe(catchError(() => of([]))),
          users: this.usersApi.getAll().pipe(catchError(() => of([] as UserItem[]))),
        }).subscribe(({ invoices, users }) => {
          this.rawItemIds = invoices.map((i) => i.id);
          this.rows.set(invoices.map((i) => this.mapInvoiceRow(i, users)));
          this.loading.set(false);
        });
        break;

      case 'payments':
      case 'collections':
      case 'notifications':
        // These resources depend on controllers not yet implemented or specific facture IDs
        this.rows.set([]);
        this.loading.set(false);
        break;

      default:
        this.rows.set([]);
        this.loading.set(false);
    }
  }

  private mapDevisRow(d: QuoteItem): string[] {
    const client = this.usersMap.get(d.clientId);
    const clientName = client ? `${client.prenom} ${client.nom}` : d.clientId;
    const statutLabel = this.formatStatut(d.statut);
    return [
      d.titre ?? 'Sans titre',
      clientName,
      statutLabel,
      this.formatDate(d.dateCreation),
      d.version ?? 'V1',
      'Voir | Modifier',
    ];
  }

  private mapInvoiceRow(i: InvoiceItem, users: UserItem[]): string[] {
    const client = users.find((u) => u.id === i.clientId);
    const clientName = client ? `${client.prenom} ${client.nom}` : i.clientId;
    const statutLabel = this.formatStatut(i.statut);

    return [
      i.titre ?? 'Sans titre',
      clientName,
      statutLabel,
      this.formatDate(i.dateEcheance),
      `${i.resteACharge} €`,
      'Voir',
    ];
  }

  private mapAvoirRow(a: AvoirItem): string[] {
    return [
      a.id.substring(0, 8).toUpperCase(),
      a.factureId ? a.factureId.substring(0, 8) : '-',
      `${a.montant} €`,
      this.formatStatut(a.statut),
      'Voir',
    ];
  }

  private formatStatut(statut: string): string {
    const map: Record<string, string> = {
      BROUILLON: 'Brouillon',
      ENVOYE: 'Envoyé',
      EN_NEGOCIATION: 'En négociation',
      APPROUVE: 'Approuvé',
      REFUSE: 'Refusé',
      EXPIRE: 'Expiré',
      EMISE: 'Émise',
      REALISEE: 'Réalisée',
      CLOTUREE: 'Clôturée',
      ANNULEE: 'Annulée',
      ENREGISTRE: 'Enregistré',
      REJETE: 'Rejeté',
      REMBOURSE: 'Remboursé',
      DISPONIBLE: 'Disponible',
      COMPENSE: 'Compensé',
      ANNULE: 'Annulé',
    };
    return map[statut] ?? statut;
  }

  private formatDate(dateStr: string | null): string {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('fr-FR');
    } catch {
      return dateStr;
    }
  }

  getQueryValue(key: string): string {
    return this.route.snapshot.queryParamMap.get(key) ?? '';
  }

  updateFilter(key: string, value: string): void {
    const queryParams = { ...this.route.snapshot.queryParams, [key]: value || null };
    void this.router.navigate([], { relativeTo: this.route, queryParams, queryParamsHandling: 'merge' });
  }

  onRowClick(row: string[]): void {
    const resource = this.route.snapshot.data['resource'] as string;
    const index = this.rows().indexOf(row);
    if (index >= 0 && index < this.rawItemIds.length) {
      const id = this.rawItemIds[index];
      if (resource === 'quotes') {
        void this.router.navigate(['/quotes', id]);
      } else if (resource === 'credits') {
        void this.router.navigate(['/credits', id]);
      } else if (resource === 'audit') {
        void this.router.navigate(['/audit', id]);
      } else if (resource === 'invoices') {
        void this.router.navigate(['/invoices', id]);
      }
    }
  }

  onAction(label: string): void {
    const needsConfirm = ['Annuler', 'Refuser', 'Rembourser', 'mise en demeure'].some((keyword) =>
      label.toLowerCase().includes(keyword.toLowerCase()),
    );

    if (needsConfirm) {
      const accepted = this.confirm.ask(`Confirmer l'action "${label}" ? Cette action peut être irréversible.`);
      if (!accepted) {
        return;
      }
    }

    if (label === 'Créer un devis') {
      void this.router.navigate(['/quotes/new']);
      return;
    }

    if (this.route.snapshot.data['resource'] === 'notifications' && label.toLowerCase().includes('renvoyer')) {
      const sent = this.emailService.send({
        to: 'client@example.com',
        subject: 'Relance de notification de document',
        body: 'Bonjour,\n\nNous vous renvoyons le document demandé.\n\nCordialement.',
      });
      this.toast.push(sent ? 'success' : 'error', sent ? 'Client mail ouvert.' : 'Destinataire manquant.');
      return;
    }

    this.toast.push('info', `Action "${label}" déclenchée.`);
  }
}
