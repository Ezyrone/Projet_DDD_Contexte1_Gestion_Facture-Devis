import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';
import { QuoteItem, QuoteListQuery, QuotesApiService } from './quotes-api.service';

@Injectable({ providedIn: 'root' })
export class QuotesStore {
  private readonly api = inject(QuotesApiService);
  readonly items = signal<QuoteItem[]>([]);
  readonly selected = signal<QuoteItem | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly empty = computed(() => !this.loading() && this.items().length === 0);

  /**
   * Recharge les devis depuis l'API en appliquant les filtres.
   */
  load(query: QuoteListQuery = {}): void {
    this.loading.set(true);
    this.error.set(null);
    this.api
      .list(query)
      .pipe(
        catchError(() => {
          this.error.set('Impossible de charger les devis.');
          return of([]);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((items) => this.items.set(items));
  }

  /**
   * Charge un devis par son ID.
   */
  loadById(id: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.api
      .getById(id)
      .pipe(
        catchError(() => {
          this.error.set('Impossible de charger le devis.');
          return of(null);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((item) => this.selected.set(item));
  }
}
