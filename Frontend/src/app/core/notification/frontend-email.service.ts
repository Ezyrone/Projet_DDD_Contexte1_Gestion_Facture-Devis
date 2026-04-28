import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

export interface FrontendEmailPayload {
  to: string;
  subject: string;
  body: string;
  cc?: string[];
  bcc?: string[];
}

@Injectable({ providedIn: 'root' })
export class FrontendEmailService {
  private readonly document = inject(DOCUMENT);

  /**
   * Ouvre le client mail de l'utilisateur avec un message prérempli.
   * Cette approche est totalement frontend (protocole mailto) et ne nécessite pas de backend.
   */
  send(payload: FrontendEmailPayload): boolean {
    const to = payload.to.trim();
    if (!to) {
      return false;
    }

    const params = new URLSearchParams();
    params.set('subject', payload.subject);
    params.set('body', payload.body);

    if (payload.cc?.length) {
      params.set('cc', payload.cc.join(','));
    }

    if (payload.bcc?.length) {
      params.set('bcc', payload.bcc.join(','));
    }

    const href = `mailto:${encodeURIComponent(to)}?${params.toString()}`;
    this.document.defaultView?.open(href, '_self');
    return true;
  }
}
