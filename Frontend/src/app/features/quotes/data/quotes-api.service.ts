import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface QuoteListQuery {
  search?: string;
  status?: string;
  client?: string;
  from?: string;
  to?: string;
}

export interface QuoteItem {
  id: string;
  title: string;
  client: string;
  status: string;
  createdAt: string;
  currentVersion: string;
}

@Injectable({ providedIn: 'root' })
export class QuotesApiService {
  private readonly http = inject(HttpClient);

  /**
   * Charge la liste des devis selon les filtres actifs.
   */
  list(query: QuoteListQuery): Observable<QuoteItem[]> {
    const params = new HttpParams({ fromObject: query as Record<string, string> });
    return this.http.get<QuoteItem[]>('/quotes', { params });
  }
}
