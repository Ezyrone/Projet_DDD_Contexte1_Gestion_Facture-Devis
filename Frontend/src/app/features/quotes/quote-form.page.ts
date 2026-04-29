import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { LoadingStateComponent } from '../../shared/ui/state/loading-state.component';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { QuotesApiService, QuoteItem, QuoteLine } from './data/quotes-api.service';
import { UsersApiService, UserItem } from '../shared/data/users-api.service';
import { ProduitsApiService, ProduitItem } from '../shared/data/produits-api.service';
import { catchError, forkJoin, of } from 'rxjs';

interface LineForm {
  produitId: string;
  quantite: number;
  prixUnitaire: number;
  remise: number;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, LoadingStateComponent],
  template: `
    <section class="page-header">
      <div>
        <h1>{{ modeTitle() }}</h1>
        <p>Gestion des lignes, notes et conditions spécifiques.</p>
      </div>
    </section>

    @if (loading()) {
      <app-loading-state />
    } @else {
      <form class="card form-grid" (ngSubmit)="save()">
        <label>
          <span>Titre</span>
          <input class="form-input" required [(ngModel)]="titre" name="titre" />
        </label>
        <label>
          <span>Client</span>
          <select class="form-input" [(ngModel)]="clientId" name="clientId" required>
            <option value="">-- Sélectionner --</option>
            @for (user of clients(); track user.id) {
              <option [value]="user.id">{{ user.prenom }} {{ user.nom }}</option>
            }
          </select>
        </label>
        <label class="full">
          <span>Notes client</span>
          <textarea class="form-input" [(ngModel)]="noteClient" name="noteClient"></textarea>
        </label>
        <label class="full">
          <span>Conditions spécifiques</span>
          <textarea class="form-input" [(ngModel)]="conditions" name="conditions"></textarea>
        </label>
      </form>

      <article class="card" style="margin-top: var(--space-4)">
        <h3>Lignes de devis</h3>
        @if (lignes().length > 0) {
          <div class="table-wrap" style="margin-top: var(--space-3)">
            <table class="table">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Quantité</th>
                  <th>Prix unit.</th>
                  <th>Remise</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                @for (ligne of lignes(); track $index; let i = $index) {
                  <tr>
                    <td>
                      <select class="form-input" [(ngModel)]="ligne.produitId" [name]="'produit-' + i">
                        <option value="">-- Produit --</option>
                        @for (p of produits(); track p.id) {
                          <option [value]="p.id">{{ p.nom }} ({{ p.prixUnitaire }}€)</option>
                        }
                      </select>
                    </td>
                    <td><input class="form-input" type="number" [(ngModel)]="ligne.quantite" [name]="'qte-' + i" min="1" /></td>
                    <td><input class="form-input" type="number" [(ngModel)]="ligne.prixUnitaire" [name]="'prix-' + i" step="0.01" /></td>
                    <td><input class="form-input" type="number" [(ngModel)]="ligne.remise" [name]="'remise-' + i" step="0.01" /></td>
                    <td>{{ (ligne.quantite * ligne.prixUnitaire - ligne.remise).toFixed(2) }} €</td>
                    <td><app-button variant="danger" (click)="removeLine(i)">×</app-button></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <p style="margin-top: var(--space-3); font-weight: 700">
            Total : {{ totalAmount().toFixed(2) }} €
          </p>
        } @else {
          <p class="muted" style="margin-top: var(--space-3)">Aucune ligne ajoutée.</p>
        }
        <div class="actions" style="margin-top: var(--space-3)">
          <app-button variant="secondary" (click)="addLine()">Ajouter une ligne</app-button>
        </div>
      </article>

      <div class="actions" style="margin-top: var(--space-4)">
        <app-button variant="secondary" (click)="save()">Enregistrer brouillon</app-button>
        <app-button (click)="saveAndSend()">Enregistrer et envoyer</app-button>
      </div>
    }
  `,
})
export class QuoteFormPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly quotesApi = inject(QuotesApiService);
  private readonly usersApi = inject(UsersApiService);
  private readonly produitsApi = inject(ProduitsApiService);

  readonly modeTitle = computed(() =>
    this.route.snapshot.data['mode'] === 'edit' ? 'Édition du devis' : 'Création d\u2019un devis',
  );

  readonly loading = signal(true);
  readonly clients = signal<UserItem[]>([]);
  readonly produits = signal<ProduitItem[]>([]);
  readonly lignes = signal<LineForm[]>([]);

  titre = '';
  clientId = '';
  noteClient = '';
  conditions = '';
  private existingId: string | null = null;

  readonly totalAmount = computed(() =>
    this.lignes().reduce((sum, l) => sum + (l.quantite * l.prixUnitaire - l.remise), 0)
  );

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    forkJoin({
      users: this.usersApi.getAll().pipe(catchError(() => of([]))),
      produits: this.produitsApi.getAll().pipe(catchError(() => of([]))),
      devis: id ? this.quotesApi.getById(id).pipe(catchError(() => of(null))) : of(null),
    }).subscribe(({ users, produits, devis }) => {
      this.clients.set(users.filter((u) => u.type === 'CLIENT'));
      this.produits.set(produits);

      if (devis) {
        this.existingId = devis.id;
        this.titre = devis.titre ?? '';
        this.clientId = devis.clientId ?? '';
        this.lignes.set(
          (devis.lignes ?? []).map((l) => ({
            produitId: l.produitId ?? '',
            quantite: l.quantite,
            prixUnitaire: l.prixUnitaire,
            remise: l.remise,
          }))
        );
        const clientNote = (devis.notes ?? []).find((n) => !n.interne);
        const interneNote = (devis.notes ?? []).find((n) => n.interne);
        this.noteClient = clientNote?.contenu ?? '';
        this.conditions = interneNote?.contenu ?? '';
      }

      this.loading.set(false);
    });
  }

  addLine(): void {
    this.lignes.update((lines) => [...lines, { produitId: '', quantite: 1, prixUnitaire: 0, remise: 0 }]);
  }

  removeLine(index: number): void {
    this.lignes.update((lines) => lines.filter((_, i) => i !== index));
  }

  save(): void {
    if (!this.titre.trim()) {
      this.toast.push('error', 'Le titre est obligatoire.');
      return;
    }

    const payload: any = {
      titre: this.titre,
      clientId: this.clientId || null,
      lignes: this.lignes().map((l) => ({
        produitId: l.produitId || null,
        quantite: l.quantite,
        prixUnitaire: l.prixUnitaire,
        remise: l.remise,
      })),
    };

    const request$ = this.existingId
      ? this.quotesApi.update(this.existingId, payload)
      : this.quotesApi.create(payload);

    request$.subscribe({
      next: (result) => {
        this.toast.push('success', this.existingId ? 'Devis mis à jour.' : 'Devis créé.');

        // Add notes if provided
        if (this.noteClient.trim() && result.id) {
          this.quotesApi.addNote(result.id, { contenu: this.noteClient, interne: false }).subscribe();
        }
        if (this.conditions.trim() && result.id) {
          this.quotesApi.addNote(result.id, { contenu: this.conditions, interne: true }).subscribe();
        }

        void this.router.navigate(['/quotes', result.id]);
      },
      error: () => this.toast.push('error', 'Erreur lors de la sauvegarde.'),
    });
  }

  saveAndSend(): void {
    if (!this.titre.trim()) {
      this.toast.push('error', 'Le titre est obligatoire.');
      return;
    }

    const payload: any = {
      titre: this.titre,
      clientId: this.clientId || null,
      lignes: this.lignes().map((l) => ({
        produitId: l.produitId || null,
        quantite: l.quantite,
        prixUnitaire: l.prixUnitaire,
        remise: l.remise,
      })),
    };

    const create$ = this.existingId
      ? this.quotesApi.update(this.existingId, payload)
      : this.quotesApi.create(payload);

    create$.subscribe({
      next: (result) => {
        this.quotesApi.send(result.id).subscribe({
          next: () => {
            this.toast.push('success', 'Devis créé et envoyé.');
            void this.router.navigate(['/quotes', result.id]);
          },
          error: () => {
            this.toast.push('error', 'Devis créé mais impossible de l\'envoyer.');
            void this.router.navigate(['/quotes', result.id]);
          },
        });
      },
      error: () => this.toast.push('error', 'Erreur lors de la sauvegarde.'),
    });
  }
}
