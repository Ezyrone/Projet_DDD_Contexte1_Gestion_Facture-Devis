import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AuditQuery {
  type?: string;
  actor?: string;
  from?: string;
  to?: string;
}

/**
 * Modèle d'événement de domaine retourné par le backend.
 */
export interface AuditEventItem {
  id: string;
  type: string;
  horodatage: string;
  acteur: string | null;
  documentId: string;
  payload: string;
}

@Injectable({ providedIn: 'root' })
export class AuditApiService {
  private readonly http = inject(HttpClient);

  /**
   * Charge tous les événements d'audit depuis /traces.
   */
  list(_query: AuditQuery): Observable<AuditEventItem[]> {
    return this.http.get<AuditEventItem[]>('/traces');
  }

  /**
   * Charge les événements d'audit pour un document spécifique.
   */
  listByDocument(documentId: string): Observable<AuditEventItem[]> {
    return this.http.get<AuditEventItem[]>(`/traces/${documentId}`);
  }
}
