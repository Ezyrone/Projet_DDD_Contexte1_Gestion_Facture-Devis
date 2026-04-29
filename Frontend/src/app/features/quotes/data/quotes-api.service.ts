import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface QuoteListQuery {
  search?: string;
  status?: string;
  client?: string;
  from?: string;
  to?: string;
}

/**
 * Modèle de devis retourné par le backend.
 */
export interface QuoteItem {
  id: string;
  titre: string;
  dateCreation: string;
  dateModification: string;
  dateValidite: string | null;
  statut: string;
  version: string | null;
  clientId: string;
  devise: { code: string; symbole: string } | null;
  lignes: QuoteLine[];
  notes: QuoteNote[];
  versions: QuoteVersion[];
}

export interface QuoteLine {
  id: string;
  quantite: number;
  prixUnitaire: number;
  remise: number;
  montantTotal: number;
  produitId: string;
  taxeId: string | null;
}

export interface QuoteNote {
  id: string;
  contenu: string;
  dateCreation: string;
  interne: boolean;
}

export interface QuoteVersion {
  id: string;
  numeroVersion: string;
  dateCreation: string;
  archivee: boolean;
}

@Injectable({ providedIn: 'root' })
export class QuotesApiService {
  private readonly http = inject(HttpClient);

  /**
   * Charge la liste de tous les devis depuis le backend.
   */
  list(_query: QuoteListQuery): Observable<QuoteItem[]> {
    return this.http.get<QuoteItem[]>('/devis');
  }

  /**
   * Charge un devis par son ID.
   */
  getById(id: string): Observable<QuoteItem> {
    return this.http.get<QuoteItem>(`/devis/${id}`);
  }

  /**
   * Crée un nouveau devis.
   */
  create(devis: Partial<QuoteItem>): Observable<QuoteItem> {
    return this.http.post<QuoteItem>('/devis', devis);
  }

  /**
   * Modifie un devis existant.
   */
  update(id: string, devis: Partial<QuoteItem>): Observable<QuoteItem> {
    return this.http.put<QuoteItem>(`/devis/${id}`, devis);
  }

  /**
   * Envoie le devis au client.
   */
  send(id: string): Observable<QuoteItem> {
    return this.http.post<QuoteItem>(`/devis/${id}/envoyer`, {});
  }

  /**
   * Approuve le devis.
   */
  approve(id: string): Observable<QuoteItem> {
    return this.http.post<QuoteItem>(`/devis/${id}/approuver`, {});
  }

  /**
   * Refuse le devis.
   */
  refuse(id: string): Observable<QuoteItem> {
    return this.http.post<QuoteItem>(`/devis/${id}/refuser`, {});
  }

  /**
   * Ajoute une note au devis.
   */
  addNote(id: string, note: { contenu: string; interne: boolean }): Observable<QuoteItem> {
    return this.http.post<QuoteItem>(`/devis/${id}/notes`, note);
  }
}
