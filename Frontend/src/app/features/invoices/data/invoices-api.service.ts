import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

  /**
   * Note : le FactureController backend est vide pour le moment.
   * Ce service est prêt à être connecté quand le controller sera implémenté.
   * En attendant, on retourne un tableau vide en cas d'erreur.
   */
  list(_query: InvoiceListQuery): Observable<InvoiceItem[]> {
    // Le controller facture n'est pas encore implémenté côté backend
    // On pourra remplacer par '/factures' quand il sera prêt
    return new Observable((subscriber) => {
      subscriber.next([]);
      subscriber.complete();
    });
  }
}
