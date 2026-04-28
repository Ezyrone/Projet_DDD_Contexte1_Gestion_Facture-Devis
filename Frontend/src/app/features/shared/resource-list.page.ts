import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ConfirmService } from '../../shared/ui/confirm/confirm.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { EmptyStateComponent } from '../../shared/ui/state/empty-state.component';
import { TableComponent } from '../../shared/ui/table/table.component';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { LIST_PAGE_CONFIG } from './page-config';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, EmptyStateComponent, TableComponent],
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

    @if (config().rows.length === 0) {
      <app-empty-state [title]="'Aucun résultat'" [description]="'Aucun élément trouvé.'">
        <app-button>{{ config().emptyActionLabel }}</app-button>
      </app-empty-state>
    } @else {
      <app-table [headers]="config().headers">
        @for (row of config().rows; track row[0]) {
          <tr>
            @for (col of row; track col) {
              <td>{{ col }}</td>
            }
          </tr>
        }
      </app-table>
    }
  `,
})
export class ResourceListPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly confirm = inject(ConfirmService);
  private readonly toast = inject(ToastService);
  readonly search = this.route.snapshot.queryParamMap.get('search') ?? '';

  readonly config = computed(() => {
    const key = this.route.snapshot.data['resource'] as string;
    return LIST_PAGE_CONFIG[key];
  });

  readonly roleActions = computed(() => {
    const role = this.auth.currentUser()?.role ?? 'CLIENT';
    return this.config().actions[role];
  });

  /**
   * Retourne une valeur de filtre depuis les query params.
   */
  getQueryValue(key: string): string {
    return this.route.snapshot.queryParamMap.get(key) ?? '';
  }

  /**
   * Synchronise un filtre de liste dans l'URL.
   */
  updateFilter(key: string, value: string): void {
    const queryParams = { ...this.route.snapshot.queryParams, [key]: value || null };
    void this.router.navigate([], { relativeTo: this.route, queryParams, queryParamsHandling: 'merge' });
  }

  /**
   * Déclenche une action de page avec confirmation si critique.
   */
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

    this.toast.push('info', `Action "${label}" déclenchée.`);
  }
}
