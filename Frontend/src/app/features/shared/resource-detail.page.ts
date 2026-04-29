import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { LoadingStateComponent } from '../../shared/ui/state/loading-state.component';
import { ErrorStateComponent } from '../../shared/ui/state/error-state.component';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { ConfirmService } from '../../shared/ui/confirm/confirm.service';
import { QuotesApiService, QuoteItem } from '../quotes/data/quotes-api.service';
import { AvoirsApiService, AvoirItem } from './data/avoirs-api.service';
import { UsersApiService, UserItem } from './data/users-api.service';
import { AuditApiService, AuditEventItem } from '../audit/data/audit-api.service';
import { catchError, forkJoin, of } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, ButtonComponent, LoadingStateComponent, ErrorStateComponent],
  template: `
    @if (loading()) {
      <app-loading-state />
    } @else if (errorMsg()) {
      <app-error-state [description]="errorMsg()!" (retry)="loadData()" />
    } @else {
      <section class="page-header">
        <div>
          <h1>{{ pageTitle() }}</h1>
          <p class="muted">ID: {{ id() }}</p>
        </div>
        <div class="actions">
          @for (action of actions(); track action) {
            <app-button
              [variant]="action.includes('Annuler') || action.includes('Refuser') ? 'danger' : action.includes('Approuver') ? 'primary' : 'secondary'"
              (click)="onAction(action)"
            >
              {{ action }}
            </app-button>
          }
        </div>
      </section>

      <section class="grid-two">
        @for (section of sections(); track section.title) {
          <article class="card">
            <h3>{{ section.title }}</h3>
            @if (section.items.length > 0) {
              @for (item of section.items; track $index) {
                <p>{{ item }}</p>
              }
            } @else {
              <p class="muted">Aucune donnée disponible.</p>
            }
          </article>
        }
      </section>
    }
  `,
})
export class ResourceDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmService);
  private readonly quotesApi = inject(QuotesApiService);
  private readonly avoirsApi = inject(AvoirsApiService);
  private readonly usersApi = inject(UsersApiService);
  private readonly auditApi = inject(AuditApiService);

  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly pageTitle = signal('');
  readonly id = computed(() => this.route.snapshot.paramMap.get('id') ?? 'N/A');
  readonly actions = signal<string[]>([]);
  readonly sections = signal<{ title: string; items: string[] }[]>([]);

  private devisData: QuoteItem | null = null;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const resource = this.route.snapshot.data['resource'] as string;
    const id = this.id();
    this.loading.set(true);
    this.errorMsg.set(null);

    switch (resource) {
      case 'quote':
        this.loadQuoteDetail(id);
        break;
      case 'credit':
        this.loadCreditDetail(id);
        break;
      case 'audit':
        this.loadAuditDetail(id);
        break;
      case 'invoice':
        this.pageTitle.set('Détail de la facture');
        this.actions.set(['Exporter']);
        this.sections.set([{ title: 'Information', items: ['Le controller facture n\'est pas encore implémenté côté backend.'] }]);
        this.loading.set(false);
        break;
      default:
        this.pageTitle.set('Détail');
        this.sections.set([]);
        this.loading.set(false);
    }
  }

  private loadQuoteDetail(id: string): void {
    forkJoin({
      devis: this.quotesApi.getById(id).pipe(catchError(() => of(null))),
      users: this.usersApi.getAll().pipe(catchError(() => of([] as UserItem[]))),
    }).subscribe(({ devis, users }) => {
      if (!devis) {
        this.errorMsg.set('Devis introuvable.');
        this.loading.set(false);
        return;
      }
      this.devisData = devis;
      const client = users.find((u) => u.id === devis.clientId);
      const clientName = client ? `${client.prenom} ${client.nom}` : devis.clientId;

      this.pageTitle.set(`Détail du devis — ${devis.titre ?? 'Sans titre'}`);
      this.actions.set(this.getDevisActions(devis.statut));

      const montantTotal = (devis.lignes ?? []).reduce((sum, l) => sum + (l.montantTotal || l.quantite * l.prixUnitaire - l.remise), 0);

      this.sections.set([
        {
          title: 'Récap client',
          items: [
            `Client : ${clientName}`,
            client ? `Email : ${client.email}` : '',
            client ? `Adresse : ${client.adresse}` : '',
            `Statut : ${this.formatStatut(devis.statut)}`,
            `Créé le : ${this.formatDate(devis.dateCreation)}`,
            devis.dateValidite ? `Validité : ${this.formatDate(devis.dateValidite)}` : '',
            devis.devise ? `Devise : ${devis.devise.symbole} (${devis.devise.code})` : '',
          ].filter(Boolean),
        },
        {
          title: 'Lignes et totaux',
          items: (devis.lignes ?? []).length > 0
            ? [
              ...(devis.lignes ?? []).map((l, i) =>
                `Ligne ${i + 1} : Qté ${l.quantite} × ${l.prixUnitaire} € - Remise ${l.remise} € = ${l.montantTotal || (l.quantite * l.prixUnitaire - l.remise)} €`
              ),
              `──────────`,
              `Total : ${montantTotal} €`,
            ]
            : ['Aucune ligne de devis.'],
        },
        {
          title: 'Notes et conditions',
          items: (devis.notes ?? []).length > 0
            ? (devis.notes ?? []).map((n) => `${n.interne ? '[Interne]' : '[Client]'} ${n.contenu}`)
            : ['Aucune note.'],
        },
        {
          title: 'Versions',
          items: (devis.versions ?? []).length > 0
            ? (devis.versions ?? []).map((v) => `${v.numeroVersion} — ${this.formatDate(v.dateCreation)} ${v.archivee ? '(archivée)' : ''}`)
            : ['Aucune version archivée.'],
        },
      ]);
      this.loading.set(false);
    });
  }

  private loadCreditDetail(id: string): void {
    this.avoirsApi.list().pipe(
      catchError(() => { this.errorMsg.set('Impossible de charger l\'avoir.'); return of([]); })
    ).subscribe((avoirs) => {
      const avoir = avoirs.find((a) => a.id === id);
      if (!avoir) {
        this.errorMsg.set('Avoir introuvable.');
        this.loading.set(false);
        return;
      }
      this.pageTitle.set('Détail de l\'avoir');
      this.actions.set(['Compensation', 'Remboursement']);
      this.sections.set([
        {
          title: 'Informations',
          items: [
            `Montant : ${avoir.montant} €`,
            `Statut : ${this.formatStatut(avoir.statut)}`,
            `Créé le : ${this.formatDate(avoir.dateCreation)}`,
            avoir.dateExpiration ? `Expiration : ${this.formatDate(avoir.dateExpiration)}` : '',
          ].filter(Boolean),
        },
        {
          title: 'Références',
          items: [
            avoir.factureId ? `Facture associée : ${avoir.factureId.substring(0, 8)}...` : 'Aucune facture associée',
            avoir.avenantId ? `Avenant source : ${avoir.avenantId.substring(0, 8)}...` : 'Aucun avenant source',
          ],
        },
      ]);
      this.loading.set(false);
    });
  }

  private loadAuditDetail(id: string): void {
    this.auditApi.list({}).pipe(
      catchError(() => { this.errorMsg.set('Impossible de charger l\'événement.'); return of([]); })
    ).subscribe((events) => {
      const event = events.find((e) => e.id === id);
      if (!event) {
        this.errorMsg.set('Événement introuvable.');
        this.loading.set(false);
        return;
      }
      this.pageTitle.set(`Événement d'audit — ${event.type}`);
      this.actions.set(['Exporter']);
      this.sections.set([
        {
          title: 'Détails',
          items: [
            `Type : ${event.type}`,
            `Acteur : ${event.acteur ?? 'SYSTEME'}`,
            `Horodatage : ${this.formatDate(event.horodatage)}`,
            `Document : ${event.documentId}`,
          ],
        },
        {
          title: 'Payload',
          items: [event.payload || 'Aucun payload.'],
        },
      ]);
      this.loading.set(false);
    });
  }

  private getDevisActions(statut: string): string[] {
    switch (statut) {
      case 'BROUILLON':
        return ['Modifier', 'Envoyer'];
      case 'ENVOYE':
      case 'EN_NEGOCIATION':
        return ['Approuver', 'Refuser'];
      case 'APPROUVE':
        return ['Exporter'];
      default:
        return ['Exporter'];
    }
  }

  onAction(action: string): void {
    const needsConfirm = ['Annuler', 'Refuser', 'Rembourser', 'Compensation'].some((k) =>
      action.toLowerCase().includes(k.toLowerCase())
    );

    if (needsConfirm) {
      const accepted = this.confirm.ask(`Confirmer "${action}" ? Cette action peut être irréversible.`);
      if (!accepted) return;
    }

    const resource = this.route.snapshot.data['resource'] as string;
    const id = this.id();

    if (resource === 'quote') {
      this.handleDevisAction(action, id);
      return;
    }

    this.toast.push('info', `Action "${action}" déclenchée.`);
  }

  private handleDevisAction(action: string, id: string): void {
    switch (action) {
      case 'Modifier':
        void this.router.navigate(['/quotes', id, 'edit']);
        break;
      case 'Envoyer':
        this.quotesApi.send(id).subscribe({
          next: () => { this.toast.push('success', 'Devis envoyé.'); this.loadData(); },
          error: (e) => this.toast.push('error', e.error?.message || 'Impossible d\'envoyer le devis.'),
        });
        break;
      case 'Approuver':
        this.quotesApi.approve(id).subscribe({
          next: () => { this.toast.push('success', 'Devis approuvé.'); this.loadData(); },
          error: (e) => this.toast.push('error', e.error?.message || 'Impossible d\'approuver le devis.'),
        });
        break;
      case 'Refuser':
        this.quotesApi.refuse(id).subscribe({
          next: () => { this.toast.push('success', 'Devis refusé.'); this.loadData(); },
          error: (e) => this.toast.push('error', e.error?.message || 'Impossible de refuser le devis.'),
        });
        break;
      default:
        this.toast.push('info', `Action "${action}" déclenchée.`);
    }
  }

  private formatStatut(statut: string): string {
    const map: Record<string, string> = {
      BROUILLON: 'Brouillon', ENVOYE: 'Envoyé', EN_NEGOCIATION: 'En négociation',
      APPROUVE: 'Approuvé', REFUSE: 'Refusé', EXPIRE: 'Expiré',
      DISPONIBLE: 'Disponible', COMPENSE: 'Compensé', REMBOURSE: 'Remboursé', ANNULE: 'Annulé',
    };
    return map[statut] ?? statut;
  }

  private formatDate(dateStr: string | null): string {
    if (!dateStr) return '-';
    try { return new Date(dateStr).toLocaleDateString('fr-FR'); } catch { return dateStr; }
  }
}
