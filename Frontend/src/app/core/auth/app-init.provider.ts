import { APP_INITIALIZER, Provider } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

function initializeSession(authService: AuthService): () => Promise<void> {
  return () => firstValueFrom(authService.restoreSession());
}

export const authInitializerProvider: Provider = {
  provide: APP_INITIALIZER,
  multi: true,
  useFactory: initializeSession,
  deps: [AuthService],
};
