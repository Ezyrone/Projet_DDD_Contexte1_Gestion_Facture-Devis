import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';
import { InvoiceItem, InvoiceListQuery, InvoicesApiService } from './invoices-api.service';

@Injectable({ providedIn: 'root' })
export class InvoicesStore {
  private readonly api = inject(InvoicesApiService);
  readonly items = signal<InvoiceItem[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly empty = computed(() => !this.loading() && this.items().length === 0);

  /**
   * Recharge les factures avec les filtres en cours.
   */
  load(query: InvoiceListQuery): void {
    this.loading.set(true);
    this.error.set(null);
    this.api
      .list(query)
      .pipe(
        catchError(() => {
          this.error.set('Impossible de charger les factures.');
          return of([]);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((items) => this.items.set(items));
  }
}
