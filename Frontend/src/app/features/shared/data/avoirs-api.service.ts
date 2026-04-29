import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AvoirItem {
  id: string;
  montant: number;
  dateCreation: string;
  dateExpiration: string | null;
  statut: string;
  avenantId: string | null;
  factureId: string | null;
}

@Injectable({ providedIn: 'root' })
export class AvoirsApiService {
  private readonly http = inject(HttpClient);

  create(avoir: Partial<AvoirItem>): Observable<AvoirItem> {
    return this.http.post<AvoirItem>('/avoirs', avoir);
  }

  compensate(id: string): Observable<AvoirItem> {
    return this.http.post<AvoirItem>(`/avoirs/${id}/compenser`, {});
  }

  refund(id: string): Observable<AvoirItem> {
    return this.http.post<AvoirItem>(`/avoirs/${id}/rembourser`, {});
  }

  cancel(id: string): Observable<AvoirItem> {
    return this.http.post<AvoirItem>(`/avoirs/${id}/annuler`, {});
  }

  list(): Observable<AvoirItem[]> {
    return this.http.get<AvoirItem[]>('/avoirs');
  }
}
