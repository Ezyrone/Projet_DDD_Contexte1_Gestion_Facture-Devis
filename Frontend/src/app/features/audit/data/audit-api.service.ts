import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AuditQuery {
  type?: string;
  actor?: string;
  from?: string;
  to?: string;
}

export interface AuditEventItem {
  id: string;
  eventType: string;
  actor: string;
  objectRef: string;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class AuditApiService {
  private readonly http = inject(HttpClient);

  /**
   * Charge les événements d'audit pour les filtres donnés.
   */
  list(query: AuditQuery): Observable<AuditEventItem[]> {
    const params = new HttpParams({ fromObject: query as Record<string, string> });
    return this.http.get<AuditEventItem[]>('/audit', { params });
  }
}
