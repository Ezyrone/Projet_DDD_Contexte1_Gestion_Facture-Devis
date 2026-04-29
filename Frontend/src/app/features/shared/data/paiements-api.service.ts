import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface PaiementItem {
  id: string;
  montant: number;
  datePaiement: string;
  mode: string | null;
  statut: string;
  factureId: string;
}

export interface EcheancierItem {
  id: string;
  echeances: string[];
  montants: number[];
  factureId: string;
}

export interface RelanceItem {
  id: string;
  niveau: number;
  dateEnvoi: string;
  destinataire: string;
  type: string | null;
  factureId: string;
}

@Injectable({ providedIn: 'root' })
export class PaiementsApiService {
  private readonly http = inject(HttpClient);

  create(paiement: Partial<PaiementItem>): Observable<PaiementItem> {
    return this.http.post<PaiementItem>('/paiements', paiement);
  }

  reject(id: string): Observable<PaiementItem> {
    return this.http.post<PaiementItem>(`/paiements/${id}/rejeter`, {});
  }

  refund(id: string): Observable<PaiementItem> {
    return this.http.post<PaiementItem>(`/paiements/${id}/rembourser`, {});
  }

  listByInvoice(factureId: string): Observable<PaiementItem[]> {
    return this.http.get<PaiementItem[]>(`/paiements/facture/${factureId}`);
  }

  listAll(): Observable<PaiementItem[]> {
    return this.http.get<PaiementItem[]>('/paiements');
  }

  createEcheancier(echeancier: Partial<EcheancierItem>): Observable<EcheancierItem> {
    return this.http.post<EcheancierItem>('/paiements/echeancier', echeancier);
  }

  sendRelance(relance: Partial<RelanceItem>): Observable<RelanceItem> {
    return this.http.post<RelanceItem>('/paiements/relance', relance);
  }

  listRelances(factureId: string): Observable<RelanceItem[]> {
    return this.http.get<RelanceItem[]>(`/paiements/relances/${factureId}`);
  }

  listAllRelances(): Observable<RelanceItem[]> {
    return this.http.get<RelanceItem[]>('/paiements/relances');
  }
}
