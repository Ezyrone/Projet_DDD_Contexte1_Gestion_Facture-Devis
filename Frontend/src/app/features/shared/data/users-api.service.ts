import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface UserItem {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  adresse: string;
  type: string;
}

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<UserItem[]> {
    return this.http.get<UserItem[]>('/users');
  }

  getById(id: string): Observable<UserItem> {
    return this.http.get<UserItem>(`/users/${id}`);
  }
}
