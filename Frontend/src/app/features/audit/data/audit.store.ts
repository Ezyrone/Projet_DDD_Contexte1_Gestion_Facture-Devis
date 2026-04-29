import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';
import { AuditApiService, AuditEventItem, AuditQuery } from './audit-api.service';

@Injectable({ providedIn: 'root' })
export class AuditStore {
  private readonly api = inject(AuditApiService);
  readonly items = signal<AuditEventItem[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly empty = computed(() => !this.loading() && this.items().length === 0);

  /**
   * Recharge l'historique d'audit.
   */
  load(query: AuditQuery): void {
    this.loading.set(true);
    this.error.set(null);
    this.api
      .list(query)
      .pipe(
        catchError(() => {
          this.error.set("Impossible de charger l'audit.");
          return of([]);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((items) => this.items.set(items));
  }
}
