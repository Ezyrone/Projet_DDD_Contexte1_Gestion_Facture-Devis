import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface InvoiceListQuery {
  search?: string;
  status?: string;
  client?: string;
}

export interface InvoiceItem {
  id: string;
  title: string;
  client: string;
  status: string;
  dueDate: string;
  remainingAmount: number;
}

@Injectable({ providedIn: 'root' })
export class InvoicesApiService {
  private readonly http = inject(HttpClient);

  /**
   * Retourne la liste paginée des factures.
   */
  list(query: InvoiceListQuery): Observable<InvoiceItem[]> {
    const params = new HttpParams({ fromObject: query as Record<string, string> });
    return this.http.get<InvoiceItem[]>('/invoices', { params });
  }
}
