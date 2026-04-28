import { Injectable, signal } from '@angular/core';

type ToastKind = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  kind: ToastKind;
  text: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly messages = signal<ToastMessage[]>([]);
  private currentId = 0;

  push(kind: ToastKind, text: string): void {
    const id = ++this.currentId;
    this.messages.update((messages) => [...messages, { id, kind, text }]);
    setTimeout(() => this.remove(id), 3500);
  }

  remove(id: number): void {
    this.messages.update((messages) => messages.filter((message) => message.id !== id));
  }
}
