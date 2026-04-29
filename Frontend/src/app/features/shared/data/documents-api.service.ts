import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface DocumentExporteItem {
  id: string;
  format: string;
  dateExport: string;
  chemin: string;
  acteur: string;
  devisId: string | null;
  factureId: string | null;
}

export interface ImportDocumentItem {
  id: string;
  fichierSource: string;
  dateImport: string;
  erreurs: string[];
  succes: boolean;
  devisId: string | null;
}

@Injectable({ providedIn: 'root' })
export class DocumentsApiService {
  private readonly http = inject(HttpClient);

  export(format: string, chemin: string, acteur: string, devisId?: string, factureId?: string): Observable<DocumentExporteItem> {
    let params = new HttpParams()
      .set('format', format)
      .set('chemin', chemin)
      .set('acteur', acteur);
    if (devisId) params = params.set('devisId', devisId);
    if (factureId) params = params.set('factureId', factureId);
    return this.http.post<DocumentExporteItem>('/documents/export', null, { params });
  }

  import(fichier: string): Observable<ImportDocumentItem> {
    const params = new HttpParams().set('fichier', fichier);
    return this.http.post<ImportDocumentItem>('/documents/import', null, { params });
  }

  listExports(): Observable<DocumentExporteItem[]> {
    return this.http.get<DocumentExporteItem[]>('/documents/exports');
  }

  listImports(): Observable<ImportDocumentItem[]> {
    return this.http.get<ImportDocumentItem[]>('/documents/imports');
  }
}
