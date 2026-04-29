import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ProduitItem {
  id: string;
  nom: string;
  prixUnitaire: number;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class ProduitsApiService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<ProduitItem[]> {
    return this.http.get<ProduitItem[]>('/api/products');
  }

  getById(id: string): Observable<ProduitItem> {
    return this.http.get<ProduitItem>(`/api/products/${id}`);
  }
}
