import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

export interface InvoiceListQuery {
  search?: string;
  status?: string;
  client?: string;
}

/**
 * Modèle de facture retourné par le backend.
 * Note : FactureController est vide côté backend,
 * mais les données sont chargées via MockDataLoader.
 * En attendant l'implémentation complète du controller,
 * on utilise les données mock disponibles.
 */
export interface InvoiceItem {
  id: string;
  titre: string;
  dateCreation: string;
  dateEcheance: string | null;
  statut: string;
  montantTotal: number;
  resteACharge: number;
  clientId: string;
  devisId: string | null;
  devise: { code: string; symbole: string } | null;
}

@Injectable({ providedIn: 'root' })
export class InvoicesApiService {
  private readonly http = inject(HttpClient);

  list(query: InvoiceListQuery): Observable<InvoiceItem[]> {
    let params = new HttpParams();
    if (query.search) params = params.set('search', query.search);
    if (query.status) params = params.set('status', query.status);
    if (query.client) params = params.set('client', query.client);

    return this.http.get<InvoiceItem[]>('/factures', { params });
  }

  getById(id: string): Observable<InvoiceItem> {
    return this.http.get<InvoiceItem>(`/factures/${id}`);
  }

  annuler(id: string): Observable<InvoiceItem> {
    return this.http.post<InvoiceItem>(`/factures/${id}/annuler`, {});
  }
}
